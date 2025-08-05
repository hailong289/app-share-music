import mongoose, { Schema } from 'mongoose';
import { IAlbum } from '../types/music.types';

const AlbumSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  cover_url: {
    type: String,
    trim: true,
  },
});

// Create indexes
AlbumSchema.index({ artist_id: 1 });
AlbumSchema.index({ title: 1 });

export default mongoose.model<IAlbum>('Album', AlbumSchema);
