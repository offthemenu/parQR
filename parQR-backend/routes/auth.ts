import express, { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import { userInfo } from 'os';

export const authRoutes = express.Router();

//Registering new user
authRoutes.post('/register', async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;

        //Check if user already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered. Please log in."
            });
        }

        // Generate a new userCode and qrCodeId
        const userCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 character hex
        const qrCodeId = crypto.randomBytes(8).toString('hex').toUpperCase(); // 16 character hex

        const newUser = new User({
            phoneNumber,
            userCode,
            qrCodeId
        });
        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            data: {
                userId: savedUser._id,
                userCode: savedUser.userCode,
                qrCodeId: savedUser.qrCodeId
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "server error", error: error.message });
    }
});

//Login user by verifying phone number
authRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;

        //find the user by phone number
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please register." });
        }

        //return the user details
        res.status(200).json({
            success: true,
            data: {
                userId: user._id,
                userCode: user.userCode,
                qrCodeId: user.qrCodeId,
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "server error", error: error.message });
    }
});