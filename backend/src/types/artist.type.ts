import { Types, Document } from 'mongoose';

export interface IArtist extends Document {
  _id: Types.ObjectId;
  name: string;
  bio: string;
  image_url: string;
}
