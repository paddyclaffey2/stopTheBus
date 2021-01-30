const app = require('express');
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: true,
  origins: ['*']
});

let usersConnected = [];

io.on('connection', (socket) => {

  socket.on('disconnect', (session) => {
    // getClients();
    console.log('user disconnected');
    // socket.usersConnected
    // connectionChanged();
  });

  socket.on('sendName', (data) => {
    // socket.set('nickname', data.userName);   
    console.log('user: ' + data.userName);
  });

  socket.on('sendName', (data) => {
    // socket.set('nickname', data.userName);   
    console.log('user: ' + data.userName);
  });
  
  socket.on('create-room', function(room) {
    console.log('creating room: ' + room);
    socket.join(room);
  });
  
  socket.on('join-room', function(room) {
    console.log('joining room: ' + room);
    socket.join(room);
  });

});

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
