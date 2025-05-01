const Message = require("../Models/messageModel");

const chatSocket = (io, socket) => {
  console.log("User connected:", socket.id);

  // When a user sends a message
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      // Save the message to the database
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
      });
      await newMessage.save();

      // Emit the message to the specific receiver (freelancer)
      io.to(receiverId).emit("receiveMessage", newMessage);  // Send to the receiver

      // Optionally, send the message to the sender as well
      io.to(senderId).emit("receiveMessage", newMessage);  // Send to the sender (client)
      
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};

module.exports = chatSocket;
