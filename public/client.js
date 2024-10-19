const socket = io();
const chatWindow = document.getElementById('chat-window');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const fileInput = document.getElementById('fileInput');

// Fungsi untuk menambahkan pesan ke jendela chat
function addMessage(username, message) {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${username}:</strong> ${message}`;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Fungsi untuk mengirim pesan
function sendMessage() {
  const message = messageInput.value;
  const username = usernameInput.value;

  if (message) {
    socket.emit('chat message', { username, message });
    messageInput.value = ''; // Kosongkan input setelah terkirim
  }
}

// Kirim pesan saat tombol 'Send' diklik
sendBtn.addEventListener('click', sendMessage);

// Kirim pesan saat tombol Enter ditekan
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Kirim file saat user memilih file
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const username = usernameInput.value;

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('file upload', {
        username,
        file: reader.result,
        filename: file.name,
      });
    };
    reader.readAsDataURL(file);
  }
});

// Terima pesan dari server
socket.on('chat message', (data) => {
  addMessage(data.username, data.message);
});

// Terima file dari server
socket.on('file upload', (data) => {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${data.username}:</strong> <a href="${data.file}" target="_blank">${data.filename}</a>`;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
