import mongoose, { Schema, Document } from 'mongoose';

export interface IParking extends Document {
  userId: mongoose.Types.ObjectId;
  location?: string; // Optional for geolocation data (latitude, longitude)
  startTime: Date;
  endTime?: Date; // Optional, as it may be auto-ended if not manually closed
}

const ParkingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: false },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: false },
});

export default mongoose.model<IParking>('Parking', ParkingSchema);
