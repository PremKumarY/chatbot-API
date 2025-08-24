import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import leadRoutes from "./routes/leads.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------- MongoDB Connect -------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ------------------- Routes -------------------
app.use("/api/chat", chatRoutes);
app.use("/api/leads", leadRoutes);

// Optional: health check
app.get("/", (req, res) => res.send("ijekerTech Chat Server running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
