import ApiService from "@/services/api";
import type { Album, Artist, Playlist, SearchAll, Session, Song, Stats, User } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  currentSongDetail: Song;
  searchSongData: Song[];
  searchAllData: SearchAll;
  albums: Album[];
  playlists: Playlist[];
  artists: User[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  currentSession: Session;
  featuredSession: Session;
  popularRadio: Session;
  popularArtist: Session;
  stats: Stats;

  fetchArtists: () => Promise<void>;
  fetchAlbums: (params) => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>;
  fetchSessionById: (id: string) => Promise<void>;
  fetchArtistById: (id: string) => Promise<void>;
  fetchSongById: (id: string) => Promise<void>;
  fetchHomeData: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: (params) => Promise<void>;
  searchSongs: (params) => Promise<void>;
  searchAll: (params) => Promise<void>;
  refreshSearchSongs: () => void;
  fetchPlayList: () => Promise<void>;
  addSong: (data: any) => Promise<void>;
  addAlbum: (data: any) => Promise<void>;
  addPlaylist: (data: any) => Promise<void>;
  addSongToPlaylist: (playlistId, songId) => Promise<void>;
  addArtist: (data: any) => Promise<void>;
  editPlaylist: (id, data: any) => Promise<void>;
  editSong: (id, data: any) => Promise<void>;
  editAlbum: (id, data: any) => Promise<void>;
  editArtist: (id, data: any) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  playlists: [],
  songs: [],
  searchSongData: [],
  artists: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  popularRadio: {},
  featuredSession: {},
  popularArtist: {},
  stats: {
    totalSong: 0,
    totalAlbum: 0,
    totalUser: 0,
    totalArtist: 0,
  },

  addSong: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.post(`/songs`, data);
      console.log("Song add successfully");
      toast.success("Song updated successfully");
    } catch (error: any) {
      console.log("Error in addSong", error);
      toast.error("Error adding song");
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToPlaylist: async (playlistId, songId) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.post(`/playlists/${playlistId}/add-song`, {song_id : songId, order: 1});
      console.log("Playlist add successfully");
    } catch (error: any) {
      console.log("Error in addPlaylist", error);
      toast.error("Error adding playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  addPlaylist: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.post(`/playlists`, data);
      console.log("Playlist add successfully");
    } catch (error: any) {
      console.log("Error in addPlaylist", error);
      toast.error("Error adding playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  addArtist: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.post(`/users/create-artist`, data);
      console.log("Artist add successfully");
    } catch (error: any) {
      console.log("Error in addArtist", error);
      toast.error("Error adding Artist");
    } finally {
      set({ isLoading: false });
    }
  },

  editPlaylist: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.patch(`/playlists/${id}`, data);
      console.log("Playlist edit successfully");
      toast.success("Playlist edited successfully");
    } catch (error: any) {
      console.log("Error in editPlaylist", error);
      toast.error("Error editing playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  editSong: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.patch(`/songs/${id}`, data);
      console.log("Song edit successfully");
      toast.success("Song edited successfully");
    } catch (error: any) {
      console.log("Error in editSong", error);
      toast.error("Error editing song");
    } finally {
      set({ isLoading: false });
    }
  },

  editAlbum: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.patch(`/albums/${id}`, data);
      console.log("Album edit successfully");
      toast.success("Album edited successfully");
    } catch (error: any) {
      console.log("Error in editAlbum", error);
      toast.error("Error editing album");
    } finally {
      set({ isLoading: false });
    }
  },

  editArtist: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.patch(`/users/update-artist/${id}`, data);
      console.log("Artist edit successfully");
      toast.success("Artist edited successfully");
    } catch (error: any) {
      console.log("Error in editArtist", error);
      toast.error("Error editing artist");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.delete(`/songs/${id}`);

      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      console.log("Error in deleteSong", error);
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteArtist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.delete(`/users/delete-artist/${id}`);

      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Artist deleted successfully");
    } catch (error: any) {
      console.log("Error in deleteArtist", error);
      toast.error("Error deleting Artist");
    } finally {
      set({ isLoading: false });
    }
  },

  addAlbum: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.post(`/albums`, data);
      console.log("Album add successfully");
			toast.success("Album created successfully");
    } catch (error: any) {
      console.log("Error in addAlbum", error);
      toast.error("Error adding Album");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.delete(`/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title
            ? { ...song, album: null }
            : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album: " + error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get("/songs", params);
      console.log("Fetched songs:", response.data);

      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  searchSongs: async (params = {}) => {
    try {
      const response = await ApiService.get("/songs", params);
      console.log("Fetched searchSongData:", response.data);
      set({ searchSongData: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  refreshSearchSongs: () => {
    set({ searchSongData: [] });
  },

  searchAll: async (params = {}) => {
    try {
      const response = await ApiService.get("/search", params);
      console.log("Fetched searchAllData:", response.data);
      set({ searchAllData: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get("/reports");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchArtists: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await ApiService.get("/users/artists");
      set({ artists: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ApiService.get("/albums", params);
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // const response = await ApiService.get(`/albums/${id}`);
      // set({ currentAlbum: response.data });
      const { albums } = useMusicStore.getState();
      const currentAlbum: Album | null =
        albums.find((a) => a._id === id) ?? null;
      console.log("albums", albums, currentAlbum);

      set({ currentAlbum });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSessionById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get(`/sessions/${id}`);
      set({ currentSession: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchArtistById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get(`/songs/artist/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get(`/songs/${id}`);
      set({ currentSongDetail: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHomeData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get("/home");
      console.log("Home data:", response.data);
      set({ featuredSession: response.data[0], popularArtist: response.data[1], popularRadio: response.data[3] });

    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlayList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get("/playlists/users");
      set({ playlists: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylistById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ApiService.get(`/playlists/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ApiService.delete(`/playlists/${id}`);

      set((state) => ({
        playlists: state.playlists.filter((playList) => playList._id !== id),
      }));
      toast.success("Playlist deleted successfully");
    } catch (error: any) {
      console.log("Error in deletePlaylist", error);
      toast.error("Error deleting Playlist");
    } finally {
      set({ isLoading: false });
    }
  },

}));
