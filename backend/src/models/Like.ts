import mongoose, { Schema } from 'mongoose';
import { ILike } from '../types/music.types';

const LikeSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  song_id: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
  },
  liked_at: {
    type: Date,
    default: Date.now,
  },
});

// Create compound unique index to prevent duplicate likes
LikeSchema.index({ user_id: 1, song_id: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
