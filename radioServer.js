const net = require('net');
var radio = require("radio-stream");

const JsonSocket = require('./json-socket');
const urlParser = require('./parser')

// construct a server
let server = new net.Server(socket => {

  socket = new JsonSocket(socket);

  socket.on('error', console.error);

  socket.on('parse', (data) => { console.log("parsing:", data) })

  socket.on('data', data => {

    switch (data.emit) {

      case 'radioIp':
        const radioIp = data.radioIp

        const stream = radio.createReadStream(radioIp);

        stream.on("connect", function () {
          console.error("Radio Stream connected!");
          // console.error(stream.headers);
        });

        // When a 'metadata' event happens, usually a new song is starting.
        stream.on("metadata", function (title) {
          socket.write({ emit: 'radioTitle', title })
        }); break;

      case 'parse': (async () => {
        // const searchInput = data.searchInput
        console.log('parse')
        let parsed = await urlParser(data.searchInput)
        console.log(parsed)

        socket.write({ emit: 'parse', data: parsed })
      })()
      break;
    }


  });

});

server.on('connection', function (conn) {

  console.log('connection made...\n')

  conn.on('data', function (data) {
    console.log('data received');
    console.log('data is: \n' + data);
  });
  conn.on('end', function (data) {
    console.log('data received');
    console.log('data is: \n' + data);
  });
})

server.listen(9000);