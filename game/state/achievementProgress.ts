// Utility to compute progress toward unlocking an achievement
export function getAchievementProgress(
	achievement,
	userStats
) {
	if (!achievement.criteria) return 1;
	let progress = 0;
	let total = 0;
	for (const key in achievement.criteria) {
		total += 1;
		if (userStats[key] >= achievement.criteria[key])
			progress += 1;
	}
	return progress / total;
}
