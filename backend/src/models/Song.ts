import mongoose, { Schema } from 'mongoose';
import { ISong } from '../types/music.types';

const SongSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  album_id: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  audio_url: {
    type: String,
    required: true,
    trim: true,
  },
  track_number: {
    type: Number,
    min: 1,
  },
});

SongSchema.index({ title: 1 });
SongSchema.index({ artist_id: 1 });
SongSchema.index({ album_id: 1 });
SongSchema.index({ album_id: 1, track_number: 1 });

export default mongoose.model<ISong>('Song', SongSchema);
