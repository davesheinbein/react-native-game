import { MMKV } from 'react-native-mmkv';
import { maybeSubmitHighScore } from './firebaseConfigLeaderboard';

const storage = new MMKV();

/**
 * Save any value (object, array, number, string) to MMKV storage.
 * @param key Storage key
 * @param value Value to store (will be JSON-stringified)
 */
export function saveStat<T = any>(
	key: string,
	value: T
): void {
	try {
		storage.set(key, JSON.stringify(value));
	} catch (e) {
		console.error(
			`Failed to save stat for key '${key}':`,
			e
		);
	}
}

/**
 * Retrieve a value from MMKV storage, with optional fallback.
 * Handles JSON parsing errors gracefully.
 * @param key Storage key
 * @param fallback Value to return if key is not found or parse fails
 * @returns Parsed value or fallback
 */
export function getStat<T = any>(
	key: string,
	fallback?: T
): T | undefined {
	const val = storage.getString(key);
	if (val) {
		try {
			return JSON.parse(val) as T;
		} catch (e) {
			console.warn(
				`Corrupt or invalid JSON for key '${key}':`,
				e
			);
			removeStat(key); // Clean up corrupt data
		}
	}
	return fallback;
}

/**
 * Remove a stat from MMKV storage.
 * @param key Storage key
 */
export function removeStat(key: string): void {
	storage.delete(key);
}

// Example keys: 'highScore', 'bestStreaks', 'unlockedNarrations', 'recentMilestones', 'achievements'

/**
 * Update high score both locally and globally if it qualifies.
 * @param params.name Player name
 * @param params.score New high score
 * @param params.mode Game mode
 * @param params.region Optional region
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
}): Promise<void> {
	saveStat('highScore', score);
	try {
		await maybeSubmitHighScore({
			name,
			score,
			mode,
			region,
		});
	} catch (e) {
		console.error(
			'Failed to submit high score globally:',
			e
		);
	}
}
