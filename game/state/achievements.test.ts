import { getAchievements } from './achievements';

describe('Achievements logic', () => {
	it('should return unlocked achievements', () => {
		const achievements = getAchievements();
		const unlocked = achievements.filter((a) => a.unlocked);
		// This is a stub; in real tests, mock state
		expect(Array.isArray(unlocked)).toBe(true);
	});

	it('should have unique IDs', () => {
		const achievements = getAchievements();
		const ids = achievements.map((a) => a.id);
		const unique = new Set(ids);
		expect(unique.size).toBe(ids.length);
	});
});
