// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import chatRoutes from "./routes/chat.js";
// import leadRoutes from "./routes/leads.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ------------------- MongoDB Connect -------------------
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));

// // ------------------- Routes -------------------
// app.use("/api/chat", chatRoutes);
// app.use("/api/leads", leadRoutes);

// // Optional: health check
// app.get("/", (req, res) => res.send("ijekerTech Chat Server running 🚀"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import chatRoutes from "./routes/chat.js";
import leadRoutes from "./routes/leads.js";

dotenv.config();

const app = express();

// ✅ CORS: sirf aapki company website allow
app.use(cors({
  origin: ["https://www.ijekertech.com"], // apni website ka URL daalo
  methods: ["POST"],
}));

app.use(express.json());

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 requests per IP
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

// Optional: health check
app.get("/", (req, res) => res.send("ijekerTech Chat Server running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
