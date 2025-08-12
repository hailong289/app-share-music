import mongoose from "mongoose";

/**
 * Bảng playlist và session
 * @typedef SessionsPlayList
 * @property {mongoose.Types.ObjectId} playlist_id - ID của playlist
 * @property {mongoose.Types.ObjectId} session_id - ID của session
 */
const SessionsPlayList: mongoose.Schema = new mongoose.Schema({
  playlist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true,
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionsGender',
    required: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

SessionsPlayList.index({ playlist_id: 1, session_id: 1 });

export default mongoose.model('SessionsPlayList', SessionsPlayList);
