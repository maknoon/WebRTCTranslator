const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Translate = require('@google-cloud/translate');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

io.on('connection', async socket => {
    console.log('a user connected');

    socket.on('chat message', async(msg) => {
        const translate = new Translate();
        var target = 'zh-TW';

        translate
            .translate(msg, target)
            .then(results => {
                let translations = results[0];
                translations = Array.isArray(translations)
                  ? translations
                  : [translations];
                io.emit('chat message', 'Translations: ');
                console.log('Translations:');
                translations.forEach((translation, i) => {
                    io.emit('chat message', `${text[i]} => (${target}) ${translation}`);
                    console.log(`${text[i]} => (${target}) ${translation}`);
                });
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
        // console.log('message: ' + msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});