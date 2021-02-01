const app = require('express');
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: true,
  origins: ['*']
});

let usersConnected = [];

io.on('connection', (socket) => {

  usersChanged = () => {
    socket.emit('number-of-user-changed', usersConnected.length);
  }

  socket.on('disconnect', (session) => {
    usersConnected = usersConnected.filter(one => one.id !== socket.id);
    console.log(usersConnected)
    usersChanged();
  });

  socket.on('sendName', (data) => {
    console.log('user: ' + data.userName);
    var userNameTaken = !!usersConnected.filter(one => one.name === data.userName).length;
    console.log('userNameTaken: ' + userNameTaken);
    if (!userNameTaken) {
      usersConnected.push({ name: data.userName, id: socket.id});
    }
    usersChanged();
    socket.emit('confirm-name', userNameTaken);
  });

  socket.on('sendName', (data) => {
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
