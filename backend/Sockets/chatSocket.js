// Sockets/chatSocket.js
const users = new Map();

const chatSocket = (io, socket) => {
  // Join event: Register user with socket ID
  socket.on("join", (userId) => {
    if (userId) {
      users.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ID ${socket.id}`);
    } else {
      console.log("join event received with no userId");
    }
  });

  // Send message event
  socket.on("sendMessage", (data) => {
    console.log("sendMessage event received:", data);

    if (!data.receiverId) {
      console.log("sendMessage failed: receiverId not provided.");
      return;
    }

    const receiverSocketId = users.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", data);
      console.log(`Message sent to socket ID: ${receiverSocketId}`);
    } else {
      console.log(" User is offline or socket ID not found for receiverId:", data.receiverId);
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }

    console.log("Updated Users Map after disconnect:", users);
  });
};

module.exports = chatSocket;
