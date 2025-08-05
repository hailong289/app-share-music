import mongoose, { Schema } from 'mongoose';
import { IDownload } from '../types/music.types';

const DownloadSchema: Schema = new Schema({
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
  downloaded_at: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
DownloadSchema.index({ user_id: 1 });
DownloadSchema.index({ song_id: 1 });

export default mongoose.model<IDownload>('Download', DownloadSchema);
