import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';
import { useGameStore } from '../game/state/useGameStore';

// Map soundtrack index to require()'d file
const soundtrackFiles = [
	require('../assets/sounds/music/song-1.wav'),
	require('../assets/sounds/music/song-2.wav'),
];

export function useMusicPlayer() {
	const musicIndex = useGameStore((s) => s.musicIndex);
	const isMusicPlaying = useGameStore(
		(s) => s.isMusicPlaying
	);
	const isMusicMuted = useGameStore((s) => s.isMusicMuted);
	const setMusicIndex = useGameStore(
		(s) => s.setMusicIndex
	);
	const setIsMusicPlaying = useGameStore(
		(s) => s.setIsMusicPlaying
	);
	const soundRef = useRef<Audio.Sound | null>(null);

	// Load and play/pause music on state change
	useEffect(() => {
		let isMounted = true;
		async function loadAndPlay() {
			if (soundRef.current) {
				await soundRef.current.unloadAsync();
				soundRef.current = null;
			}
			if (isMusicMuted || !isMusicPlaying) return;
			// Only try to play if the file exists for the current index
			const file =
				soundtrackFiles[musicIndex] || soundtrackFiles[0];
			try {
				const { sound } = await Audio.Sound.createAsync(
					file,
					{ shouldPlay: true, isLooping: true, volume: 1.0 }
				);
				if (!isMounted) return;
				soundRef.current = sound;
				await sound.playAsync();
			} catch (e) {
				console.warn('Music file failed to load/play:', e);
			}
		}
		loadAndPlay();
		return () => {
			isMounted = false;
			if (soundRef.current) {
				soundRef.current.unloadAsync();
				soundRef.current = null;
			}
		};
	}, [musicIndex, isMusicPlaying, isMusicMuted]);

	// Pause/resume on play state change
	useEffect(() => {
		if (!soundRef.current) return;
		if (isMusicPlaying && !isMusicMuted) {
			soundRef.current.playAsync();
		} else {
			soundRef.current.pauseAsync();
		}
	}, [isMusicPlaying, isMusicMuted]);

	// Cycle to next track (only cycle through available files)
	const nextTrack = () => {
		setMusicIndex(
			(idx) => (idx + 1) % soundtrackFiles.length
		);
		setIsMusicPlaying(true);
	};

	return {
		isMusicPlaying,
		isMusicMuted,
		musicIndex,
		nextTrack,
		setIsMusicPlaying,
		setMusicIndex,
	};
}
