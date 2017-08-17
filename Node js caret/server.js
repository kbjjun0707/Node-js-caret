var port = process.env.port || 1337;
var express = require('express');
var app = express();
var fs = require('fs');


app.get('/', function (req, res) {
    fs.readFile(__dirname + '/test.html', function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data.toString());
            res.end();
        }
    });
});

app.get('/CDN/:filename', function (req, res) {
    fs.readFile(__dirname + req.url, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end();
        } else {
            res.send(data);
        }
    });
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);
require('date-utils');
var dt = new Date();

io.on('connection', function (socket) {

    socket.on('join', function (data) {
        console.log('join socket    ' + dt.toFormat('YYYY-MM-DD HH24:MI:SS'));
        socket.name = data.name;

        io.emit('join', {
            name: socket.name,
            time: dt.toFormat('YYYY-MM-DD HH24:MI:SS')
        });
    });

    socket.on('update', function (data) {

        socket.broadcast.emit('update', data);
    });

});


server.listen(port);