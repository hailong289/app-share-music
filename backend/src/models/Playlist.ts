import mongoose, { Schema } from 'mongoose';
import { IPlaylist } from '../types/music.types';

const PlaylistSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  is_public: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
PlaylistSchema.index({ user_id: 1 });
PlaylistSchema.index({ name: 1 });
PlaylistSchema.index({ is_public: 1 });

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
