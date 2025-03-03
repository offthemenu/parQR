import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { carRoutes } from "./routes/car";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5001", 10);
const MONGODB_URI = process.env.MONGODB_URI || "";

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Allow cross-origin requests

console.log("Using MongoDB URI:", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api", authRoutes);
app.use("/api", carRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

