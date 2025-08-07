import mongoose from "mongoose";

/**
 * Bảng playlist và context
 * @typedef ContextsPlayList
 * @property {mongoose.Types.ObjectId} playlist_id - ID của playlist
 * @property {mongoose.Types.ObjectId} context_id - ID của context
 * @property {mongoose.Types.ObjectId} user_id - ID của người dùng sở hữu playlist
 */
const ContextsPlayList: mongoose.Schema = new mongoose.Schema({
  playlist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true,
  },
  context_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Context',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

ContextsPlayList.index({ playlist_id: 1, context_id: 1 });

export default mongoose.model('ContextsPlayList', ContextsPlayList);
