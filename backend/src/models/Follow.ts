import mongoose, { Schema } from 'mongoose';
import { IFollow } from '../types/music.types';

const FollowSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
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
