import mongoose, { Schema } from 'mongoose';
import { IPlaylistSong } from '../types/music.types';

/**
 * Bảng bài hát trong playlist
 * @typedef PlaylistSong
 * @property {mongoose.Types.ObjectId} playlist_id - ID của playlist
 * @property {mongoose.Types.ObjectId} song_id - ID của bài hát
 * @property {Date} added_at - Ngày thêm bài hát vào playlist
 * @property {number} order - Thứ tự của bài hát trong playlist
 */

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
}, {
  timestamps: true, // Automatically manage created_at and updated_at fields
});

// Create compound indexes
PlaylistSongSchema.index({ playlist_id: 1, order: 1 });
PlaylistSongSchema.index({ song_id: 1 });

export default mongoose.model<IPlaylistSong>('PlaylistSong', PlaylistSongSchema);
