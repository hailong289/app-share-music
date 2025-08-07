import mongoose, { Schema } from 'mongoose';
import { IGenre } from '../types/music.types';

/**
 * Bảng thể loại nhạc
 * @typedef Genre
 */
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

export default mongoose.model<IGenre>('Genre', GenreSchema);
