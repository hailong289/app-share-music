import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types/music.types';

const CommentSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  song_id: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
CommentSchema.index({ song_id: 1 });
CommentSchema.index({ user_id: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);
