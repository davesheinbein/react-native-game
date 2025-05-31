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
	const isMuted = useGameStore((s) => s.isMuted);
	const setMusicIndex = useGameStore(
		(s) => s.setMusicIndex
	);
	const setIsMusicPlaying = useGameStore(
		(s) => s.setIsMusicPlaying
	);
	const soundRef = useRef<Audio.Sound | null>(null);
	const positionRef = useRef<number>(0); // Track playback position

	// Load and play/pause music on state change
	useEffect(() => {
		let isMounted = true;
		async function loadAndPlay() {
			if (soundRef.current) {
				// Save position before unloading
				const status =
					await soundRef.current.getStatusAsync();
				if (status.isLoaded) {
					positionRef.current = status.positionMillis || 0;
				}
				await soundRef.current.unloadAsync();
				soundRef.current = null;
			}
			if (isMusicMuted || isMuted || !isMusicPlaying)
				return;
			const file =
				soundtrackFiles[musicIndex] || soundtrackFiles[0];
			try {
				const { sound } = await Audio.Sound.createAsync(
					file,
					{
						shouldPlay: false,
						isLooping: true,
						volume: 1.0,
					}
				);
				if (!isMounted) return;
				soundRef.current = sound;
				// Seek to previous position if available
				if (positionRef.current > 0) {
					await sound.setPositionAsync(positionRef.current);
				}
				await sound.playAsync();
			} catch (e) {
				console.warn('Music file failed to load/play:', e);
			}
		}
		loadAndPlay();
		return () => {
			isMounted = false;
			if (soundRef.current) {
				soundRef.current.getStatusAsync().then((status) => {
					if (status.isLoaded) {
						positionRef.current =
							status.positionMillis || 0;
					}
				});
				soundRef.current.unloadAsync();
				soundRef.current = null;
			}
		};
	}, [musicIndex, isMusicPlaying, isMusicMuted, isMuted]);

	// Pause/resume on play state change
	useEffect(() => {
		if (!soundRef.current) return;
		if (isMusicPlaying && !isMusicMuted && !isMuted) {
			// Resume from last position
			soundRef.current.getStatusAsync().then((status) => {
				if (
					soundRef.current &&
					status.isLoaded &&
					positionRef.current > 0
				) {
					soundRef.current.setPositionAsync(
						positionRef.current
					);
				}
				if (soundRef.current) {
					soundRef.current.playAsync();
				}
			});
		} else {
			// Save position and pause
			soundRef.current.getStatusAsync().then((status) => {
				if (soundRef.current && status.isLoaded) {
					positionRef.current = status.positionMillis || 0;
					soundRef.current.pauseAsync();
				}
			});
		}
	}, [isMusicPlaying, isMusicMuted, isMuted]);

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
