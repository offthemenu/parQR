import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId?: mongoose.Types.ObjectId; // Optional for non-users
  recipientId: mongoose.Types.ObjectId;
  carId: mongoose.Types.ObjectId;
  timestamp: Date;
  content: string;
  status: string; // For example, "pending" or "completed"
}

const MessageSchema: Schema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true },
  status: { type: String, default: "pending" },
});

export default mongoose.model<IMessage>('Message', MessageSchema);