import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import User from "./models/User";
import Car from "./models/Car";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "";

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Allow cross-origin requests
app.use(express.json()); // parse JSON request bodies

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// code for testing routes below
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    // Check if phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this phone number already exists.",
      });
    }

    const userCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-char hex code for user
    const qrCodeId = crypto.randomBytes(8).toString("hex"); //16-char hex code for QR

    // create new user
    const newUser = new User({
      phoneNumber,
      userCode,
      qrCodeId,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      data: {
        userId: savedUser._id,
        userCode: savedUser.userCode,
        qrCodeId: savedUser.qrCodeId,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
});

app.post("/api/register-car", async (req: Request, res: Response) => {
  try {
    const { ownerId, licensePlate, carModel, carBrand } = req.body;

    // Check if the license plate already exists
    const existingCar = await Car.findOne({ licensePlate });
    if (existingCar) {
      return res.status(400).json({
        success: false,
        message: "Car with this license plate already exists.",
      });
    }

    // Create a new car document
    const newCar = new Car({
      ownerId,
      licensePlate,
      carModel,
      carBrand,
    });

    const savedCar = await newCar.save();

    res.status(201).json({
      success: true,
      data: {
        carId: savedCar._id,
        licensePlate: savedCar.licensePlate,
        carModel: savedCar.carModel,
        carBrand: savedCar.carBrand,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
});

