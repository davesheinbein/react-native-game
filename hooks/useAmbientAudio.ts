import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useGameStore } from '../game/state/useGameStore';

// Simple procedural/generative ambient audio hook
// Uses Tone.js for web, expo-av for native fallback
export function useAmbientAudio() {
	const started = useRef(false);
	const isMuted = useGameStore((s) => s.isMuted);

	useEffect(() => {
		let cleanup: (() => void) | undefined;
		if (isMuted) {
			// If muted, stop any playing music
			if (Platform.OS === 'web' && started.current) {
				import('tone').then((Tone) => {
					Tone.Transport.stop();
				});
				started.current = false;
			} else if (Platform.OS !== 'web') {
				// Native: stop sound if needed
				// (No persistent ref, so nothing to stop here)
			}
			return;
		}
		if (Platform.OS === 'web' && !started.current) {
			import('tone').then((Tone) => {
				// Heartbeat: deep bass + reverb for body
				const bass = new Tone.MembraneSynth({
					pitchDecay: 0.15,
					octaves: 1.1,
					oscillator: { type: 'sine' },
					envelope: {
						attack: 0.01,
						decay: 0.45,
						sustain: 0.12,
						release: 0.4,
					},
				});
				const reverb = new Tone.Reverb({
					decay: 2.5,
					preDelay: 0.04,
					wet: 0.45,
				}).toDestination();
				bass.connect(reverb);

				const patterns = [
					[0, 320, 900, 1220],
					[0, 270, 800, 1070],
					[0, 370, 1050, 1420],
					[0, 210, 700, 910, 1220],
				];
				let patternIdx = 0;
				let beatIdx = 0;

				const playBeat = (time: number) => {
					// Bass "lub"
					bass.triggerAttackRelease('F0', '8n', time, 1.0);
					// Bass "dub" (softer, slightly delayed)
					setTimeout(() => {
						bass.triggerAttackRelease(
							'C1',
							'16n',
							undefined,
							0.6
						);
					}, 100);
				};

				const loop = new Tone.Loop((time: number) => {
					const pattern = patterns[patternIdx];
					if (beatIdx >= pattern.length) {
						patternIdx = (patternIdx + 1) % patterns.length;
						beatIdx = 0;
					}
					playBeat(time);
					const nextDelay =
						pattern[beatIdx + 1] ?
							pattern[beatIdx + 1] - pattern[beatIdx]
						:	600;
					loop.interval = nextDelay / 1000;
					beatIdx++;
				}, 0.6).start(0);

				Tone.Transport.bpm.value = 90;
				Tone.Transport.start();
				started.current = true;

				cleanup = () => {
					loop.stop();
					Tone.Transport.stop();
					bass.dispose();
					reverb.dispose();
				};
			});
		} else if (Platform.OS !== 'web') {
			// Native: fallback to static ambient loop using expo-av
			let sound: any = null;
			(async () => {
				try {
					const { Audio } = await import('expo-av');
					sound = new Audio.Sound();
					await sound.loadAsync(
						require('../assets/sounds/music/ambient-loop.mp3')
					);
					await sound.setIsLoopingAsync(true);
					await sound.playAsync();
				} catch (e) {
					// ignore
				}
			})();
			cleanup = () => {
				if (sound) sound.unloadAsync();
			};
		}
		return () => {
			if (cleanup) cleanup();
		};
	}, [isMuted]);
}
