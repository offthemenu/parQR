import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { sender_id, recipient_id, car_id, message_content } = req.body;

        try {
            const client = await clientPromise;
            const db = client.db("parQR")
            const messagesCollection = db.collection("messages");

            const newMessage = {
                sender_id: new ObjectId(sender_id),
                recipient_id: new ObjectId(recipient_id),
                car_id: new ObjectId(car_id),
                message_content,
                timestamp: new Date(),
            };

            const result = await messagesCollection.insertOne(newMessage);

            return res.status(201).json({
                message: "Message sent successfully",
                messageId: result.insertedId
            });
        } catch (error) {
            return res.status(500).json({ message: "Failed to send message", error });
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}