var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

var translationLanguage = 'fr';

io.on('connection', async (socket) => {
    socket.on('chat message', function(msg) {
        const Translate = require('@google-cloud/translate');
        const translate = new Translate({
            key: process.env.API_KEY
        });
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
                    io.emit('chat message', `=> (${target}) ${translation}`);
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
http.listen(port, () => {
    console.log('Starting propagander');
});
