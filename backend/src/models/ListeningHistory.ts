import mongoose, { Schema } from 'mongoose';
import { IListeningHistory } from '../types/music.types';

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
ListeningHistorySchema.index({ user_id: 1, listened_at: -1 });
ListeningHistorySchema.index({ song_id: 1 });
ListeningHistorySchema.index({ listened_at: -1 });

export default mongoose.model<IListeningHistory>('ListeningHistory', ListeningHistorySchema);
