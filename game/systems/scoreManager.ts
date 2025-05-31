import { useGameStore } from '../state/useGameStore';

export function getCurrentStreak() {
	return useGameStore.getState().streakScore;
}

export function setCurrentStreak(streak: number) {
	useGameStore.getState().setStreakScore(streak);
}

export function getHighScore() {
	return useGameStore.getState().highScore;
}

export function setHighScore(score: number) {
	if (score > useGameStore.getState().highScore) {
		useGameStore.getState().setHighScore(score);
	}
}
