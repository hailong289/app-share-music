import mongoose from "mongoose";

/**
 * Bảng ngữ cảnh của người dùng
 * @typedef Context
 * @property {mongoose.Types.ObjectId} genre_id - ID của thể loại
 * @property {string} name - Tên ngữ cảnh
 * @property {Date} created_at - Ngày tạo ngữ cảnh
 * @property {Date} expires_at - Ngày hết hạn của ngữ cảnh
 *  Ngữ cảnh có thể được sử dụng để lưu trữ các thông tin tạm thời liên quan đến người dùng, chẳng hạn như thể loại yêu thích hoặc các tùy chọn cá nhân hóa khác.
 */
const Contexts: mongoose.Schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  genre_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});


Contexts.index({ user_id: 1 });

export default mongoose.model('Context', Contexts);
