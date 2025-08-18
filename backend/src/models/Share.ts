import mongoose, { Schema } from 'mongoose';
import { IShare } from '../types/music.types';

/**
 * Bảng chia sẻ bài hát
 * @typedef Share
 * @property {mongoose.Types.ObjectId} song_id - ID của bài hát được chia sẻ
 * @property {mongoose.Types.ObjectId} playlist_id - ID của playlist được chia sẻ (nếu có)
 * @property {mongoose.Types.ObjectId} album_id - ID của album được chia sẻ (nếu có)
 * @property {string} platform - Nền tảng chia sẻ (ví dụ: Facebook, Zalo, Email, Twitter, WhatsApp, Telegram, Other)
 * @property {Date} shared_at - Ngày chia sẻ
 * @property {Date} created_at - Ngày tạo bản ghi chia sẻ
 * @property {Date} updated_at - Ngày cập nhật bản ghi chia sẻ
 * @property {number} total_shares - Tổng số lượt chia sẻ
 *
 */
const ShareSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  share_type_id: {
    type: Schema.Types.ObjectId,
    require: true,
    refPath: 'share_type',
  },
  share_type: {
    type: String,
    required: true,
    enum: ['Song', 'Playlist', 'Album'],
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
  total_shares: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

// Create indexes
ShareSchema.index({ song_id: 1 });
ShareSchema.index({ platform: 1 });

export default mongoose.model<IShare>('Share', ShareSchema);
