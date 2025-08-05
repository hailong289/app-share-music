import mongoose, { Schema } from 'mongoose';
import { IPlaylistSong } from '../types/music.types';

const PlaylistSongSchema: Schema = new Schema({
  playlist_id: {
    type: Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true,
  },
  song_id: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
  },
  added_at: {
    type: Date,
    default: Date.now,
  },
  order: {
    type: Number,
    required: true,
    min: 1,
  },
});

// Create compound indexes
PlaylistSongSchema.index({ playlist_id: 1, order: 1 });
PlaylistSongSchema.index({ song_id: 1 });

export default mongoose.model<IPlaylistSong>('PlaylistSong', PlaylistSongSchema);
