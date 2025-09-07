export interface Song {
	_id: string;
	title: string;
	artists: any;
	albumId: string | null;
	imageUrl: string;
	banner_url: string;
	audio_url: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	cover_url: string;
	image_url: string;
	release_date: string;
	total_songs: number;
	songs: Song[];
	banner_url: string;
	name: string;
}

export interface Playlist {
	_id: string;
	name: string;
	artist: string;
	banner_url: string;
	description: string;
	total_songs: number;
	songs: Song[];
}

export interface Artist {
	_id: string;
	name: string;
	image_url: string;
	songs: Song[];
}

export interface Stats {
	totalSong: number;
	totalAlbum: number;
	totalUser: number;
	totalArtist: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	email: string;
	image_url: string;
	name: string;
	role: string;
}

export interface Session {
	_id: string;
	name: string;
  order_index: number;
  session_items: []
  items: []
}

export interface SearchAll {
  songs: []
  artists: []
  albums: []
}
