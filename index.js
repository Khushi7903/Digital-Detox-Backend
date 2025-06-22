// backend/index.js or server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/scoreRoutes");
const Message = require("./models/Message"); // ✅ Import your schema

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // For development only; restrict in production
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Socket.IO Chat Logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  // Join a unique room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    Message.find({ room })
      .sort({ timestamp: 1 })
      .then((messages) => {
        socket.emit("chatHistory", messages);
      });
  });

  // Handle sending messages
  socket.on("chatMessage", async ({ room, sender, receiver, senderName, text }) => {
    if (!room || !sender || !receiver || !text) {
      return; // Ensure all required data is present
    }

    const msg = new Message({
      room,
      sender,
      receiver,
      senderName,
      text,
      timestamp: new Date()
    });

    try {
      const savedMsg = await msg.save();
      io.to(room).emit("chatMessage", savedMsg); // Broadcast to room
    } catch (err) {
      console.error("❌ Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
