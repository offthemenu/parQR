import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phoneNumber: string;
  userCode: string;
  qrCodeId: string;
}

const UserSchema: Schema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  userCode: { type: String, required: true, unique: true },
  qrCodeId: { type: String, required: true, unique: true },
});

export default mongoose.model<IUser>('Users', UserSchema);