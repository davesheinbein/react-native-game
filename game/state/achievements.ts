import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export type Achievement = {
	id: string;
	title: string;
	description: string;
	unlocked: boolean;
	unlockDate?: string;
};

const ACHIEVEMENTS_KEY = 'achievements';

export function getAchievements(): Achievement[] {
	const val = storage.getString(ACHIEVEMENTS_KEY);
	if (val) {
		try {
			return JSON.parse(val) as Achievement[];
		} catch {}
	}
	return [];
}

export function unlockAchievement(id: string) {
	const achievements = getAchievements();
	const now = new Date().toISOString();
	const updated = achievements.map((a) =>
		a.id === id ?
			{ ...a, unlocked: true, unlockDate: now }
		:	a
	);
	storage.set(ACHIEVEMENTS_KEY, JSON.stringify(updated));
}

export function addAchievement(achievement: Achievement) {
	const achievements = getAchievements();
	if (!achievements.find((a) => a.id === achievement.id)) {
		achievements.push(achievement);
		storage.set(
			ACHIEVEMENTS_KEY,
			JSON.stringify(achievements)
		);
	}
}
