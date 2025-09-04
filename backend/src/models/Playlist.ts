import mongoose, { Schema } from 'mongoose';
import { IPlaylist } from '../types/music.types';
/**
 *  Bảng danh sách phát nhạc
 *  @typedef Playlist
 *  @property {ObjectId} user_id - ID của người dùng sở hữu danh sách phát
 *  @property {String} name - Tên của danh sách phát
 * @property {String} [description] - Mô tả của danh sách phát
 * @property {Boolean} is_public - Trạng thái công khai của danh sách phát
 * @property {Date} created_at - Ngày tạo danh sách phát
 * @property {Date} updated_at - Ngày cập nhật danh sách phát
 * @property {Number} total_songs - Tổng số bài hát trong danh sách phát
 * @property {Number} total_duration - Tổng thời gian của các bài hát trong danh sách
 * @property {Number} total_likes - Tổng số lượt thích của danh sách phát
 * @property {Number} total_downloads - Tổng số lượt tải của danh sách phát
 */
const PlaylistSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  is_public: {
    type: Boolean,
    default: false,
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
  banner_url: {
    type: String,
    required: true,
    trim: true,
    get: (v: string) => {
      if (!v) return '';
      return `${process.env.APP_URL}/${v.replace(/\\/g, '/')}`;
    },
  },
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  }
}, {
  timestamps: true, // Automatically manage created_at and updated_at fields
});

// Create indexes
PlaylistSchema.index({ user_id: 1 });
PlaylistSchema.index({ name: 1 });
PlaylistSchema.index({ is_public: 1 });

PlaylistSchema.set("toJSON", { getters: true });
PlaylistSchema.set("toObject", { getters: true });

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
