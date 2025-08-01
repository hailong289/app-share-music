import mongoose, { Schema } from 'mongoose';
import { IGenre } from '../types/music.types';

const GenreSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
});

// Create indexes
GenreSchema.index({ name: 1 });

export default mongoose.model<IGenre>('Genre', GenreSchema);
