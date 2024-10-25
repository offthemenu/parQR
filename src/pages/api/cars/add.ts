import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { owner_id, license_plate, car_model } = req.body;

        try {
            const client = await clientPromise;
            const db = client.db("parQR");
            const carsCollection = db.collection("cars");
            const usersCollection = db.collection("users");

            const newCar = {
                license_plate,
                car_model,
                owner_id: new ObjectId(owner_id),
            };

            const result = await carsCollection.insertOne(newCar);

            await usersCollection.updateOne(
                { _id: new ObjectId(owner_id) },
                { $push: {cars: result.insertedId } }

            );

            return res.status(201).json({
                message: "Car added successfully",
                car: { _id: result.insertedId, ...newCar }
            });
        } catch (error) {
            return res.status(500).json({ message: "Faled to add car", error });
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}