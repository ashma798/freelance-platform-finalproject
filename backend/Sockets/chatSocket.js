// Sockets/chatSocket.js
const users = new Map();

const chatSocket = (io, socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ID ${socket.id}`);
  });

  socket.on("sendMessage", (data) => {
    const receiverSocketId = users.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", data);
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
};

module.exports = chatSocket;
