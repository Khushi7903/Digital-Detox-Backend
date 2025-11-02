const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// Load env variables
dotenv.config();

// Import Routes & Models
const authRoutes = require("./routes/authRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const contactRoute = require("./routes/contactRoute");
const Message = require("./models/Message");
const sendEmailRoute = require("./routes/sendEmail");
const Mentor = require("./routes/mentorRoutes");

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://surakshabuddyapp.vercel.app",
      "https://www.surakshabuddy.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://surakshabuddyapp.vercel.app",
    "https://www.surakshabuddy.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api", contactRoute);
app.use("/api", sendEmailRoute);
app.use("/api/mentors", Mentor);

// Default Route
app.get("/", (req, res) => {
  res.send("✅ Digital Detox Backend is Live");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err.message));

// // Socket.IO Real-Time Chat Logic
// io.on("connection", (socket) => {
//   console.log("🔌 New client connected");

//   // Join room
//   socket.on("joinRoom", (room) => {
//     if (!room) return;
//     socket.join(room);

//     Message.find({ room })
//       .sort({ timestamp: 1 })
//       .then((messages) => {
//         socket.emit("chatHistory", messages);
//       })
//       .catch((err) => console.error("❌ Fetch chat history error:", err));
//   });

//   // Receive message
//   socket.on("chatMessage", async ({ room, sender, receiver, senderName, text }) => {
//     if (!room || !sender || !receiver || !text) return;

//     const newMessage = new Message({
//       room,
//       sender,
//       receiver,
//       senderName,
//       text,
//       timestamp: new Date(),
//     });

//     try {
//       const savedMessage = await newMessage.save();
//       io.to(room).emit("chatMessage", savedMessage);
//     } catch (err) {
//       console.error("❌ Message save failed:", err.message);
//     }
//   });

//   // Disconnect
//   socket.on("disconnect", () => {
//     console.log("❌ Client disconnected");
//   });
// });

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});