import mongoose, { Schema } from 'mongoose';
import { ISong } from '../types/music.types';

/**
 * Bảng bài hát
 * @typedef Song
 * @property {string} title - Tiêu đề bài hát
 * @property {string} description - Nội dung mô tả bài hát
 * @property {string} lyrics - Lời bài hát
 * @property {ObjectId} album_id - ID của album chứa bài hát (nếu có)
 * @property {ObjectId} playlist_id - ID của playlist chứa bài hát (nếu có)
 * @property {ObjectId} user_id - ID của người dùng thể hiện bài hát
 * @property {number} duration - Thời lượng bài hát tính bằng giây
 * @property {string} audio_url - URL của tệp âm thanh bài hát
 * @property {number} [track_number] - Số thứ tự của bài hát trong album (nếu có)
 * @property {Date} created_at - Ngày tạo bài hát
 * @property {Date} updated_at - Ngày cập nhật bài hát
 */
const SongSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
  },
  lyrics: {
    type: String,
    trim: true,
  },
  album_id: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  banner_url: {
    type: String,
    required: true,
    trim: true,
    get: (value: string) => {
      if (!value) return '';
      return `${process.env.APP_URL}/${value}`;
    },
  },
  audio_url: {
    type: String,
    required: true,
    trim: true,
    get: (value: string) => {
      if (!value) return '';
      return `${process.env.APP_URL}/${value}`;
    },
  },
  track_number: {
    type: Number,
    min: 1,
  },
  total_likes: {
    type: Number,
    default: 0,
  },
  total_downloads: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true, // Automatically manage created_at and updated_at fields
});

SongSchema.index({ title: 1 });
SongSchema.index({ user_id: 1 });
SongSchema.index({ album_id: 1 });
SongSchema.index({ track_number: 1 });

SongSchema.set('toJSON', { getters: true });
SongSchema.set('toObject', { getters: true });

export default mongoose.model<ISong>('Song', SongSchema);
