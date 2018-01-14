var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

http.listen(3000, function() {
    console.log('listening on *:3000');
});