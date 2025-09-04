import { Types, Document } from 'mongoose';

export interface IAlbum extends Document {
  _id: Types.ObjectId;
  title: string;
  artist_id: Types.ObjectId;
  release_date: Date;
  cover_url: string;
}

export interface ISong extends Document {
  _id: Types.ObjectId;
  title: string;
  album_id?: Types.ObjectId;
  artist_id: Types.ObjectId;
  duration: number;
  audio_url: string;
  track_number?: number;
}

export interface IPlaylist extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: Date;
}

export interface IPlaylistSong extends Document {
  playlist_id: Types.ObjectId;
  song_id: Types.ObjectId;
  added_at: Date;
  order: number;
}

export interface IListeningHistory extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  song_id: Types.ObjectId;
  listened_at: Date;
}

export interface IFollow extends Document {
  user_id: Types.ObjectId;
  artist_id: Types.ObjectId;
  followed_at: Date;
}

export interface ILike extends Document {
  user_id: Types.ObjectId;
  song_id: Types.ObjectId;
  liked_at: Date;
}

export interface IGenre extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
}

export interface ISongGenre extends Document {
  song_id: Types.ObjectId;
  genre_id: Types.ObjectId;
}

export interface IComment extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  song_id: Types.ObjectId;
  text: string;
  created_at: Date;
}

export interface IShare extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  song_id: Types.ObjectId;
  platform: string;
  shared_at: Date;
}

export interface IDownload extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  song_id: Types.ObjectId;
  downloaded_at: Date;
}

export interface ISession extends Document {
  _id: Types.ObjectId;
  context_id: Types.ObjectId | null; // Reference to Genre or null for Home
  context_type: 'home' | 'genre';
}

export interface ISessionItem extends Document {
  item_id: Types.ObjectId;
  item_type: 'playlist' | 'album';
  session_id: Types.ObjectId;
  order_index: number;
}

