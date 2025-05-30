import { Audio } from 'expo-av';
import { useRef } from 'react';

export function useSound() {
	const soundRef = useRef<Audio.Sound | null>(null);

	async function playSound(uri: string) {
		if (soundRef.current) {
			await soundRef.current.unloadAsync();
		}
		const { sound } = await Audio.Sound.createAsync({
			uri,
		});
		soundRef.current = sound;
		await sound.playAsync();
	}

	async function stopSound() {
		if (soundRef.current) {
			await soundRef.current.stopAsync();
			await soundRef.current.unloadAsync();
			soundRef.current = null;
		}
	}

	return { playSound, stopSound };
}
