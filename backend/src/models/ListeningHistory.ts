import mongoose, { Schema } from 'mongoose';
import { IListeningHistory } from '../types/music.types';

/**
 * Bảng lịch sử nghe nhạc
 * @typedef ListeningHistory
 */
const ListeningHistorySchema: Schema = new Schema({
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
  listened_at: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
ListeningHistorySchema.index({ user_id: 1 });
ListeningHistorySchema.index({ song_id: 1 });

export default mongoose.model<IListeningHistory>('ListeningHistory', ListeningHistorySchema);
