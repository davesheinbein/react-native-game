import {
	getUserStats,
	incrementUserStat,
	updateUserStats,
} from './userStats';

describe('userStats', () => {
	it('should return default stats', () => {
		const stats = getUserStats();
		expect(stats.totalJumps).toBeDefined();
		expect(stats.gamesPlayed).toBeDefined();
	});

	it('should update and persist stats', () => {
		updateUserStats({ totalJumps: 42 });
		const stats = getUserStats();
		expect(stats.totalJumps).toBe(42);
	});

	it('should increment stats', () => {
		incrementUserStat('gamesPlayed');
		const stats = getUserStats();
		expect(stats.gamesPlayed).toBeGreaterThanOrEqual(1);
	});
});
