import mongoose from "mongoose";

export interface IArtistSong extends Document {
  artist_id: mongoose.Types.ObjectId;
  song_id: mongoose.Types.ObjectId;
}


const ArtistSongSchema = new mongoose.Schema({
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IArtistSong>('ArtistSong', ArtistSongSchema);
