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
const Mentor = require("./routes/mentorRoute");

// Create Express app and HTTP server
const app = express();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://surakshabuddyapp.vercel.app",
    ],
    methods: ["GET", "POST"],
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://surakshabuddyapp.vercel.app",
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


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
