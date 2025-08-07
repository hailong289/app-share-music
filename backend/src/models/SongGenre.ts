import mongoose, { Schema } from 'mongoose';
import { ISongGenre } from '../types/music.types';

/**
 * Bảng thể loại của bài hát
 * @typedef SongGenre
 * @property {mongoose.Types.ObjectId} song_id - ID của bài hát
 * @property {mongoose.Types.ObjectId} genre_id - ID của thể loại
 */
const SongGenreSchema: Schema = new Schema({
  song_id: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
  },
  genre_id: {
    type: Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  },
});


SongGenreSchema.index({ song_id: 1 }, { unique: true });
SongGenreSchema.index({ genre_id: 1 });

export default mongoose.model<ISongGenre>('SongGenre', SongGenreSchema);
