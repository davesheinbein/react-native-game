import { MMKV } from 'react-native-mmkv';
import { maybeSubmitHighScore } from './firebaseConfigLeaderboard';

const storage = new MMKV();

// Save any value (object, array, number, string)
export function saveStat(key: string, value: any) {
	storage.set(key, JSON.stringify(value));
}

// Retrieve a value, with optional fallback
type StatType<T> = T | undefined;
export function getStat<T = any>(
	key: string,
	fallback?: T
): StatType<T> {
	const val = storage.getString(key);
	if (val) return JSON.parse(val);
	return fallback;
}

// Remove a stat
export function removeStat(key: string) {
	storage.delete(key);
}

// Example keys: 'highScore', 'bestStreaks', 'unlockedNarrations', 'recentMilestones', 'achievements'

/**
 * Update high score both locally and globally if it qualifies.
 * @param {Object} params
 * @param {string} params.name - Player name
 * @param {number} params.score - New high score
 * @param {string} params.mode - Game mode
 * @param {string} [params.region] - Optional region
 */
export async function updateHighScoreEverywhere({
	name,
	score,
	mode,
	region,
}: {
	name: string;
	score: number;
	mode: string;
	region?: string;
}) {
	// Save locally
	saveStat('highScore', score);
	// Update global leaderboard if needed
	await maybeSubmitHighScore({ name, score, mode, region });
}
