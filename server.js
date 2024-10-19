const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Saat user mengirim pesan
  socket.on('chat message', (data) => {
    io.emit('chat message', {
      username: data.username || 'Anonim',
      message: data.message,
    });
  });

  // Saat user mengirim file
  socket.on('file upload', (data) => {
    io.emit('file upload', {
      username: data.username || 'Anonim',
      file: data.file,
      filename: data.filename,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
