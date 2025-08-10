import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

const createdSongs: Song[] = [
  {
    _id: "City Rain",
    title: "City Rain",
    artist: "Urban Echo",
    imageUrl: "/cover-images/7.jpg",
    audioUrl: "/songs/7.mp3",
    duration: 39, // 0:39
  },
  {
    _id: "Neon Lights",
    title: "Neon Lights",
    artist: "Night Runners",
    imageUrl: "/cover-images/5.jpg",
    audioUrl: "/songs/5.mp3",
    duration: 36, // 0:36
  },
  {
    _id: "Urban Jungle",
    title: "Urban Jungle",
    artist: "City Lights",
    imageUrl: "/cover-images/15.jpg",
    audioUrl: "/songs/15.mp3",
    duration: 36, // 0:36
  },
  {
    _id: "Neon Dreams",
    title: "Neon Dreams",
    artist: "Cyber Pulse",
    imageUrl: "/cover-images/13.jpg",
    audioUrl: "/songs/13.mp3",
    duration: 39, // 0:39
  },
  {
    _id: "Summer Daze",
    title: "Summer Daze",
    artist: "Coastal Kids",
    imageUrl: "/cover-images/4.jpg",
    audioUrl: "/songs/4.mp3",
    duration: 24, // 0:24
  },
  {
    _id: "Ocean Waves",
    title: "Ocean Waves",
    artist: "Coastal Drift",
    imageUrl: "/cover-images/9.jpg",
    audioUrl: "/songs/9.mp3",
    duration: 28, // 0:28
  },
  {
    _id: "Crystal Rain",
    title: "Crystal Rain",
    artist: "Echo Valley",
    imageUrl: "/cover-images/16.jpg",
    audioUrl: "/songs/16.mp3",
    duration: 39, // 0:39
  },
  {
    _id: "Starlight",
    title: "Starlight",
    artist: "Luna Bay",
    imageUrl: "/cover-images/10.jpg",
    audioUrl: "/songs/10.mp3",
    duration: 30, // 0:30
  },
  {
    _id: "Stay With Me",
    title: "Stay With Me",
    artist: "Sarah Mitchell",
    imageUrl: "/cover-images/1.jpg",
    audioUrl: "/songs/1.mp3",
    duration: 46, // 0:46
  },
  {
    _id: "Midnight Drive",
    title: "Midnight Drive",
    artist: "The Wanderers",
    imageUrl: "/cover-images/2.jpg",
    audioUrl: "/songs/2.mp3",
    duration: 41, // 0:41
  },
  {
    _id: "Moonlight Dance",
    title: "Moonlight Dance",
    artist: "Silver Shadows",
    imageUrl: "/cover-images/14.jpg",
    audioUrl: "/songs/14.mp3",
    duration: 27, // 0:27
  },
  {
    _id: "Lost in Tokyo",
    title: "Lost in Tokyo",
    artist: "Electric Dreams",
    imageUrl: "/cover-images/3.jpg",
    audioUrl: "/songs/3.mp3",
    duration: 24, // 0:24
  },
  {
    _id: "Neon Tokyo",
    title: "Neon Tokyo",
    artist: "Future Pulse",
    imageUrl: "/cover-images/17.jpg",
    audioUrl: "/songs/17.mp3",
    duration: 39, // 0:39
  },
  {
    _id: "Purple Sunset",
    title: "Purple Sunset",
    artist: "Dream Valley",
    imageUrl: "/cover-images/12.jpg",
    audioUrl: "/songs/12.mp3",
    duration: 17, // 0:17
  },
];
export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);

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

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
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

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });

    try {
      // const response = await axiosInstance.get("/albums");
      // set({ albums: response.data });
      const albums: Album[] = [
        {
          _id: "Urban Nights",
          title: "Urban Nights",
          artist: "Various Artists",
          imageUrl: "/albums/1.jpg",
          releaseYear: 2024,
          songs: createdSongs.slice(0, 4),
        },
        {
          _id: "Coastal Dreaming",
          title: "Coastal Dreaming",
          artist: "Various Artists",
          imageUrl: "/albums/2.jpg",
          releaseYear: 2024,
          songs: createdSongs.slice(4, 8),
        },
        {
          _id: "Midnight Sessions",
          title: "Midnight Sessions",
          artist: "Various Artists",
          imageUrl: "/albums/3.jpg",
          releaseYear: 2024,
          songs: createdSongs.slice(8, 11),
        },
        {
          _id: "Eastern Dreams",
          title: "Eastern Dreams",
          artist: "Various Artists",
          imageUrl: "/albums/4.jpg",
          releaseYear: 2024,
          songs: createdSongs.slice(11, 14),
        },
      ];
      set({ albums });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // const response = await axiosInstance.get(`/albums/${id}`);
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

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      // const response = await axiosInstance.get("/songs/featured");
      // set({ featuredSongs: response.data });
      set({ featuredSongs: createdSongs });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      // const response = await axiosInstance.get("/songs/made-for-you");
      // set({ madeForYouSongs: response.data });
      set({ madeForYouSongs: createdSongs });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      // const response = await axiosInstance.get("/songs/trending");
      // set({ trendingSongs: response.data });
      set({ trendingSongs: createdSongs.reverse() });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
