import mongoose from "mongoose";

/**
 * Quản lý nội dung động: Hôm nay Pop có 5 section, mai đổi thành 3 section thì chỉ cần sửa DB.
 * @typedef SessionsGender
 * @property {mongoose.Types.ObjectId} genre_id - ID của thể loại. nếu là genre thì là genre_id, còn Home thì NULL.
 * @property {string} name - Tên ngữ cảnh
 * @property {string} context_type - Loại ngữ cảnh (home, playlist, album, artist)
 * @property {number} order_index - Vị trí hiển thị của ngữ cảnh
 * @property {Date} created_at - Ngày tạo ngữ cảnh
 *  Ngữ cảnh có thể được sử dụng để lưu trữ các thông tin tạm thời liên quan đến người dùng, chẳng hạn như thể loại yêu thích hoặc các tùy chọn cá nhân hóa khác.
 */
const SessionsGender: mongoose.Schema = new mongoose.Schema({
  genre_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
  },
  context_type: {
    type: String,
    enum: ['home', 'playlist', 'album'],
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
  order_index: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});


SessionsGender.index({ user_id: 1 });

export default mongoose.model('SessionsGender', SessionsGender);
