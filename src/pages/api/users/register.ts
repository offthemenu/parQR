import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import QRCode from 'qrcode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { phone_number } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db('parQR');
      const usersCollection = db.collection('users');

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ phone_number });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Generate QR code and user code
      const qr_code = new ObjectId().toString();  // Use ObjectId for simplicity
      const user_code = new ObjectId().toString().slice(-6); // Generate user pass (6 digits)

      // Create QR code image
      const qrCodeImage = await QRCode.toDataURL(qr_code);

      // Insert the user into the database
      const newUser = {
        phone_number,
        qr_code,
        user_code,
        cars: [],
      };
      await usersCollection.insertOne(newUser);

      return res.status(201).json({ message: 'User registered successfully', qr_code, qrCodeImage });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to register user', error });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

