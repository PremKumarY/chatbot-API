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

if (!process.env.MONGO_URI) {
  throw new Error("❌ MONGO_URI not defined");
}

const app = express();
app.set("trust proxy", 1);

/* ---------- Middlewares ---------- */
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  /\.vercel\.app$/,
  "https://www.ijekertech.com",
  "https://ijekertech.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests (like Postman)

      if (
        allowedOrigins.some((o) =>
          o instanceof RegExp ? o.test(origin) : o === origin
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true, // <--- important for axios/fetch withCredentials
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
    console.error("❌ Mongo Error:", err);
    process.exit(1);
  });

/* ---------- Routes ---------- */
app.use("/api/chat", chatRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/certificate", certificateRoutes);

/* ---------- Health ---------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ---------- Start ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
