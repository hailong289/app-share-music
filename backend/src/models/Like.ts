import mongoose, { Schema } from 'mongoose';
import { ILike } from '../types/music.types';

/**
 * Bảng thích bài hát
 * @typedef Like
 */
const LikeSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  like_type_id: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'like_type',
  },
  like_type: {
    type: String,
    required: true,
    enum: ['Song', 'Playlist', 'Album'], // Type of like (song, playlist, album)
  },
  liked_at: {
    type: Date,
    default: Date.now,
  },
});

// Create compound unique index to prevent duplicate likes
LikeSchema.index({ user_id: 1, song_id: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
