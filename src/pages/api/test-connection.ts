import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      await client.connect();
      const db = client.db('parQR');
      const collections = await db.collections();
      res.status(200).json({ collections });
    } catch (error) {
      res.status(500).json({ error: 'Connection failed' });
    } finally {
      await client.close();
    }
  }
