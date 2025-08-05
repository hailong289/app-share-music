import { Types, Document } from 'mongoose';
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  bio: string;
  image_url: string;
  role: 'user' | 'admin' | 'artist';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}