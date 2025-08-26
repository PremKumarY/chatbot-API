import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import chatRoutes from "./routes/chat.js";
import leadRoutes from "./routes/leads.js";

dotenv.config();

const app = express();

// ✅ Security & middlewares
app.use(helmet());
app.use(morgan("dev")); // logs API calls

// ✅ CORS (allow prod + local dev)
app.use(cors({
  origin: [
    "https://www.ijekertech.com",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
}));

app.use(express.json());

// ✅ Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: "Too many requests, slow down." }
});
app.use(limiter);

// ------------------- MongoDB Connect -------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ------------------- Routes -------------------
app.use("/api/chat", chatRoutes);
app.use("/api/leads", leadRoutes);

// Health check
app.get("/", (req, res) => res.send("ijekerTech Chat Server running 🚀"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
