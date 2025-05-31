import { Audio } from 'expo-av';

// Import all milestone and fall narration audio files
const milestoneNarrations = [
	require('../assets/sounds/narration/milestones/temp-1.wav'),
	require('../assets/sounds/narration/milestones/temp-3.wav'),
	// Add more milestone narration files here as needed
];
const fallNarrations = [
	require('../assets/sounds/narration/falls/temp-2.wav'),
	// Add more fall narration files here as needed
];

let currentNarrationSound: Audio.Sound | null = null;
let narrationQueue: Array<{ file: any }> = [];
let isPlaying = false;

export async function stopNarration() {
	if (currentNarrationSound) {
		try {
			await currentNarrationSound.stopAsync();
			await currentNarrationSound.unloadAsync();
		} catch {}
		currentNarrationSound = null;
	}
	isPlaying = false;
	narrationQueue = [];
}

async function playNextInQueue() {
	if (isPlaying || narrationQueue.length === 0) return;
	const { file } = narrationQueue.shift()!;
	if (!file) {
		isPlaying = false;
		playNextInQueue();
		return;
	}
	try {
		const { sound } = await Audio.Sound.createAsync(file);
		currentNarrationSound = sound;
		isPlaying = true;
		sound.setOnPlaybackStatusUpdate((status) => {
			if (!status.isLoaded || status.didJustFinish) {
				sound.unloadAsync();
				currentNarrationSound = null;
				isPlaying = false;
				playNextInQueue();
			}
		});
		await sound.playAsync();
	} catch (e) {
		isPlaying = false;
		playNextInQueue();
	}
}

/**
 * Play a milestone narration audio file by milestone index (0-based).
 * If index is out of range, will cycle through available files.
 */
export async function playMilestoneNarration(
	milestoneIndex: number
) {
	if (milestoneNarrations.length === 0) return;
	const file =
		milestoneNarrations[
			milestoneIndex % milestoneNarrations.length
		];
	narrationQueue.push({ file });
	playNextInQueue();
}

/**
 * Play a random fall narration audio file.
 */
export async function playFallNarration() {
	if (fallNarrations.length === 0) return;
	const file =
		fallNarrations[
			Math.floor(Math.random() * fallNarrations.length)
		];
	narrationQueue.push({ file });
	playNextInQueue();
}
