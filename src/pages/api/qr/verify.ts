import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { qr_code, last_four_digits } = req.body;

        try {
            const client = await clientPromise;
            const db = client.db("parQR")
            const usersCollection = db.collection("users");
            const carsCollection = db.collection("cars");

            const user = await usersCollection.findOne({ qr_code });
            if (!user) {
                return res.status(404).json({ message: "User not found"});
            }

            const cars = await carsCollection.find({ owner_id: user._id}).toArray();
            if (cars.length === 0) {
                return res.status(404).json({ message: "No cars registered for this user"})
            }

            const matchingCar = cars.find(car => car.license_plate.endsWith(last_four_digits));
            if (!matchingCar) {
                return res.status(400).json({ message: "License plate verification failed" });
            }

            return res.status(200).json({ message: "Verification successful", car: matchingCar });
        } catch (error) {
            return res.status(500).json({ message: "Verification failed", error });
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}