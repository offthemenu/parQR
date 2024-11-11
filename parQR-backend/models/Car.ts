import mongoose, { Schema, Document } from 'mongoose';

export interface ICar extends Document {
  ownerId: mongoose.Types.ObjectId;
  licensePlate: string;
  carModel: string;
}

const CarSchema: Schema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  licensePlate: { type: String, required: true, unique: true },
  carModel: { type: String, required: true },
});

export default mongoose.model<ICar>('Car', CarSchema);

