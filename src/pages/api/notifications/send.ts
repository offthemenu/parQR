import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "POST") {
        const { recipient_id } = req.body;

        try {
            const clientDB = await clientPromise;
            const db = clientDB.db("parQR");
            const usersCollection = db.collection("users");
            
            // Fetching recipient details
            const recipient = await usersCollection.findOne({ _id: new ObjectId(recipient_id) });

            if (!recipient) {
                return res.status(404).json({ message: "Recipient not found" });
            }

            const phoneNumber = recipient.phone_number;

            // Predefined message for the MVP model
            const messageContent = "A user has requested you to move your car. Please take action accordingly.";

            // send the message
            const message = await client.messages.create({
                body: messageContent,
                from: twilioPhoneNumber,
                to: phoneNumber,
            });


            return res.status(200).json({ message: "Notification sent successfully", twilioResponse: message });
        } catch (error) {
            return res.status(500).json({ message: "Failed to send notification", error});
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" })
    }
}