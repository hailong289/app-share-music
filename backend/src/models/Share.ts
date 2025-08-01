import mongoose, { Schema } from 'mongoose';
import { IShare } from '../types/music.types';

const ShareSchema: Schema = new Schema({
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
  platform: {
    type: String,
    required: true,
    enum: ['Facebook', 'Zalo', 'Email', 'Twitter', 'WhatsApp', 'Telegram', 'Other'],
    trim: true,
  },
  shared_at: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
ShareSchema.index({ user_id: 1, shared_at: -1 });
ShareSchema.index({ song_id: 1 });
ShareSchema.index({ platform: 1 });
ShareSchema.index({ shared_at: -1 });

export default mongoose.model<IShare>('Share', ShareSchema);
