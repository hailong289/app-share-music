import mongoose, { Schema } from 'mongoose';
import { IAlbum } from '../types/music.types';

/**
 * Bảng album
 * @typedef Album
 *  @property {string} title - Tên album
 *  @property {ObjectId} artist_id - ID của nghệ sĩ sở hữu album
 *  @property {Date} release_date - Ngày phát hành album
 *  @property {string} cover_url - URL của bìa album
 */
const AlbumSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  cover_url: {
    type: String,
    trim: true,
    get: (value: string) => {
      if (!value) return '';
      return `${process.env.APP_URL}/${value}`;
    },
  },
  total_songs: {
    type: Number,
    default: 0,
  },
  total_duration: {
    type: Number,
    default: 0,
  },
  total_likes: {
    type: Number,
    default: 0,
  },
  total_downloads: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create indexes
AlbumSchema.index({ artist_id: 1 });
AlbumSchema.index({ title: 1 });

AlbumSchema.set('toJSON', { getters: true });
AlbumSchema.set('toObject', { getters: true });

export default mongoose.model<IAlbum>('Album', AlbumSchema);
