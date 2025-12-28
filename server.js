import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import chatRoutes from "./routes/chat.js";
import leadRoutes from "./routes/leads.js";
import certificateRoutes from "./routes/certificate.js";
import adminAuthRoutes from "./routes/adminAuth.js";

dotenv.config();

const app = express();

/* ---------- Middlewares ---------- */
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://www.ijekertech.com"],
    credentials: true,
  })
);

/* ---------- Rate Limit ---------- */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

/* ---------- DB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

/* ---------- Routes ---------- */
app.use("/api/certificate", certificateRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/certificate", certificateRoutes);

/* ---------- Health ---------- */
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

/* ---------- Start ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
