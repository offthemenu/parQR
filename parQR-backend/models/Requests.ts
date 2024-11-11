import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  senderId?: mongoose.Types.ObjectId; // Optional for non-users
  recipientId: mongoose.Types.ObjectId;
  carId: mongoose.Types.ObjectId;
  timestamp: Date;
  status: string; // e.g., "pending", "accepted", "rejected"
}

const RequestsSchema: Schema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
});

export default mongoose.model<IRequest>('Requests', RequestsSchema);