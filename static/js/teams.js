//socketIO
var socket = io();
console.log("js connected");
document.getElementById("create-room-btn").addEventListener("click", () => {
  const room = document.getElementById("room-input").value;
  socket.emit("create", { room: room });
});

document.getElementById("join-room-btn").addEventListener("click", () => {
  const room = document.getElementById("room-input").value;
  socket.emit("join", { room: room });
});

document.getElementById("leave-room-btn").addEventListener("click", () => {
  const room = document.getElementById("room-input").value;
  socket.emit("leave", { room: room });
});

socket.on("status", (data) => {
  const status = document.getElementById("status");
  status.innerHTML += `<p>${data.msg} (Room: ${data.room})</p>`;
});
