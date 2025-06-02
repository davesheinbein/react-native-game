// Persistent user stats for achievements, analytics, and progress
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const STATS_KEY = 'userStats';

export type UserStats = {
	totalJumps: number;
	gamesPlayed: number;
	gamesWon: number;
	maxStreak: number;
	[custom: string]: number;
};

const defaultStats: UserStats = {
	totalJumps: 0,
	gamesPlayed: 0,
	gamesWon: 0,
	maxStreak: 0,
};

export function getUserStats(): UserStats {
	const val = storage.getString(STATS_KEY);
	if (val) {
		try {
			return { ...defaultStats, ...JSON.parse(val) };
		} catch {}
	}
	return { ...defaultStats };
}

export function updateUserStats(
	partial: Partial<UserStats>
) {
	const current = getUserStats();
	const updated = { ...current, ...partial };
	storage.set(STATS_KEY, JSON.stringify(updated));
}

export function incrementUserStat(
	key: keyof UserStats,
	amount = 1
) {
	const stats = getUserStats();
	updateUserStats({ [key]: (stats[key] || 0) + amount });
}
