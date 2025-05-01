const express = require('express');
const http = require('http');
require('dotenv').config();
require("./DBConfig");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const cors = require('cors');
const Stripe = require('stripe');
const { Server } = require("socket.io");
const chatSocket = require("./Sockets/chatSocket");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
//app.use("/uploads", express.static(path.join(__dirname, "middlewares/uploads")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
io.on("connection", (socket) => {
    chatSocket(io, socket);
  });
const PORT = 5000;
server.listen(PORT,()=>{
    console.log(`server running in the port ${PORT}`);
})