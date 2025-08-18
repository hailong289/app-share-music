import mongoose, { Schema } from 'mongoose';
import { IFollow } from '../types/music.types';

/**
 * Bảng theo dõi nghệ sĩ
 * @typedef Follow
 * @property {mongoose.Types.ObjectId} user_id - ID của người dùng theo dõi
 * @property {mongoose.Types.ObjectId} artist_id - ID của nghệ sĩ được theo dõi
 * @property {Date} followed_at - Ngày theo dõi nghệ sĩ
 */
const FollowSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followed_at: {
    type: Date,
    default: Date.now,
  },
});

// Create compound unique index to prevent duplicate follows
FollowSchema.index({ user_id: 1, artist_id: 1 }, { unique: true });

export default mongoose.model<IFollow>('Follow', FollowSchema);
