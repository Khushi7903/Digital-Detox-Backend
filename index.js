const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/scoreRoutes");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // For development; restrict in production
  },
});

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://surakshabuddywebapp.vercel.app/"  // ✅ your actual Vercel frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ Digital Detox Backend is Live");
});

// Socket.IO Chat Logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  // Join a private room
  socket.on("joinRoom", (room) => {
    if (!room) return;
    socket.join(room);
    Message.find({ room })
      .sort({ timestamp: 1 })
      .then((messages) => {
        socket.emit("chatHistory", messages);
      })
      .catch((err) => console.error("❌ Fetch messages error:", err));
  });

  // Handle sending messages
  socket.on("chatMessage", async ({ room, sender, receiver, senderName, text }) => {
    if (!room || !sender || !receiver || !text) return;

    const newMessage = new Message({
      room,
      sender,
      receiver,
      senderName,
      text,
      timestamp: new Date(),
    });

    try {
      const saved = await newMessage.save();
      io.to(room).emit("chatMessage", saved);
    } catch (err) {
      console.error("❌ Message save failed:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
