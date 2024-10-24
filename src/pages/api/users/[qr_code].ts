import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {qr_code} = req.query;

    try {
        const client = await clientPromise;
        const db = client.db("parQR");
        const user = await db.collection("users").findOne({ qr_code });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userData = {
            qr_code: user.qr_code,
            user_code: user.user_code,
            cars: user.cars
        };

        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch user", error
        });
    }
}

// How it works:
// This endpoint takes a `qr_code` as a query parameter, retrieves the user
// associated with that code, and returns public details (e.g., `user_code`, `cars`).