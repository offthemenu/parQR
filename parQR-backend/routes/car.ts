import express, { Request, Response } from "express";
import Car from "../models/Car";
import User from "../models/User";

export const carRoutes = express.Router();

// POST /api/register-car
carRoutes.post("/register-car", async (req: Request, res: Response) => {
    try {
        const { userId, licensePlate, carModel, carBrand } = req.body;

        // Check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check if the license plate already exists
        const existingCar = await Car.findOne({ licensePlate });
        if (existingCar) {
            return res.status(400).json({
                success: false,
                message: "License Plate already registered.",
            });
        }

        // Register new car
        const newCar = new Car({
            ownerId: userId,
            licensePlate,
            carModel,
            carBrand,
        });

        const savedCar = await newCar.save();

        res.status(201).json({
            success: true,
            data: savedCar,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});
