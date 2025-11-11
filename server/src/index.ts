import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import callRoutes from "./routes/call.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://143.110.242.132:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "StreamIT server is running" });
});

app.use("/api/call", callRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API available at http://0.0.0.0:${PORT}/api`);
  console.log(`🌐 Accessible at http://143.110.242.132:${PORT}/api`);
});
