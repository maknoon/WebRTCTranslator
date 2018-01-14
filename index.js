var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const GoogleAuth = require('google-auth-library');

// https://stackoverflow.com/questions/43405331/
function authorize() {
    return new Promise(resolve => {
        const authFactory = new GoogleAuth();
        const jwtClient = new authFactory.JWT(
            process.env.GOOGLE_CLIENT_EMAIL, // defined in Heroku
            null,
            process.env.GOOGLE_PRIVATE_KEY, // defined in Heroku
            ['https://www.googleapis.com/auth/calendar']
        );

        jwtClient.authorize(() => resolve(jwtClient));
    });
}

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

var translationLanguage = 'fr';

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        const Translate = require('@google-cloud/translate');
        const translate = new Translate();
        // var text = 'Hello World';
        var text = msg;
        var target = translationLanguage;
        translate
            .translate(text, target)
            .then(results => {
                let translations = results[0];
                translations = Array.isArray(translations)
                  ? translations
                  : [translations];
                translations.forEach((translation, i) => {
                    io.emit('chat message', `${text[i]} => (${target}) ${translation}`);
                });
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
        // console.log('message: ' + msg);
    });

    socket.on('change language', function(msg) {
        translationLanguage = msg;
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

const port = process.env.PORT || 8000;
http.listen(port, function() {
    console.log('Starting propagander');
});
