const express = require('express')
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
const JsonSocket = require('./json-socket');


const net = require('net');
const fs = require('fs')
const clients = []

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// socket.on('close', () => clearInterval(interval));
// socket.on('error', console.error);
// socket.on('data', d => console.log(d));


io.on('connection', function (webClient) {

  console.log(`Client ${webClient.id} connected`)

  let socket = new JsonSocket()
  socket.connect({ host: 'localhost', port: 9000 })

  webClient.on('sendRadioIp', (dataFromClient) => {
    socket.write({ emit: 'radioIp', radioIp: dataFromClient })
  })

  webClient.on('parseRadioStations', (data) => {
    socket.write({ emit: 'parse', searchInput: data })
  })

  socket.on('data', (dataFromRadioService) => {
   if(dataFromRadioService.emit === 'radioTitle') webClient.emit('getRadioTitle', dataFromRadioService.title)
   if(dataFromRadioService.emit === 'parse') webClient.emit('parseRadioStations', dataFromRadioService.data)
  })
});
server.listen(8081);