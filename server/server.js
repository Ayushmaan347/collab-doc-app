const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const documentRoutes = require('./routes/documentRoutes'); 

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/docs', documentRoutes);

// Socket.io events
io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("join-doc", (docId) => {
    socket.join(docId);
    console.log(`Socket ${socket.id} joined room ${docId}`);
  });

  socket.on("send-changes", ({ docId, content }) => {
    socket.to(docId).emit("doc-update", content);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// Routes placeholder
app.get("/", (req, res) => {
  res.send("Collaborative Docs API is running...");
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
