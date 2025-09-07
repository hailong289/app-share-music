import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	// handle play/pause logic
	useEffect(() => {
		if (isPlaying) audioRef.current?.play();
		else audioRef.current?.pause();
	}, [isPlaying]);

	// handle song ends
	useEffect(() => {
		const audio = audioRef.current;

		const handleEnded = () => {
			playNext();
		};

		audio?.addEventListener("ended", handleEnded);

		return () => audio?.removeEventListener("ended", handleEnded);
	}, [playNext]);
console.log("Current Song in AudioPlayer:", currentSong);

	// handle song changes
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;

		// check if this is actually a new song
		const isSongChange = prevSongRef.current !== currentSong?.audio_url;
		if (isSongChange) {
      audio.pause();
			audio.src = `${currentSong?.audio_url}`;
      audio.load();
			// reset the playback position
			audio.currentTime = 0;

			prevSongRef.current = currentSong?.audio_url;

			if (isPlaying) audio.play();
		}
	}, [currentSong, isPlaying]);

	return <audio ref={audioRef} crossOrigin="anonymous" />;
};
export default AudioPlayer;
