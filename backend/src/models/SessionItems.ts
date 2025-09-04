import { ISessionItem } from "@/types/music.types";
import mongoose from "mongoose";

/**
 * Bảng mục trong ngữ cảnh
 * Mục này có thể là playlist hoặc album, được liên kết với một session cụ thể
 * để quản lý các mục hiển thị trong ngữ cảnh đó.
 * @typedef SessionsItems
 * @property {mongoose.Types.ObjectId} item_id - ID của playlist hoặc album
 * @property {string} item_type - Loại mục (playlist, album, artist) artist đối với khi là trang chủ
 * @property {mongoose.Types.ObjectId} session_id - ID của session
 */
const SessionsItems: mongoose.Schema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'item_type', // Reference to either Playlist or Album or Song or User
    required: true,
  },
  item_type: {
    type: String,
    enum: ['playlist', 'album', 'song', 'user'],
    required: true,
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessions',
    required: true,
  },
  order_index: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

export default mongoose.model<ISessionItem>('SessionItems', SessionsItems);
