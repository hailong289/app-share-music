import mongoose, { Schema, Document } from "mongoose";

export interface IAlbumSong extends Document {
  album_id: mongoose.Types.ObjectId;
  song_id: mongoose.Types.ObjectId;
}

/**
 * Bảng bài hát trong album
 * @typedef AlbumSong
 * @property {mongoose.Types.ObjectId} album_id - ID của album
 * @property {mongoose.Types.ObjectId} song_id - ID của bài hát
 */

const AlbumSongSchema: Schema = new Schema({
  album_id: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  },
  song_id: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IAlbumSong>('AlbumSong', AlbumSongSchema);
