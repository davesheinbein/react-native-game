export interface GameState {
	round: number;
	mode: string;
	shape: string;
	sides: number;
	safeSides: number[];
	narration: string | null;
	milestone: boolean;
	cosmeticUnlocks: string[];
	streakScore: number; // Add streakScore to state
	highScore: number; // Add highScore to state
	topScores: { name: string; score: number }[]; // Add topScores to state
}

export const initialState: GameState = {
	round: 1,
	mode: 'Classic',
	shape: 'Tetrahedron',
	sides: 3,
	safeSides: [0],
	narration: null,
	milestone: false,
	cosmeticUnlocks: [],
	streakScore: 0, // Initialize streakScore
	highScore: 0, // Initialize highScore
	topScores: [
		{ name: 'VoidWalker', score: 42 },
		{ name: 'Existentialist', score: 37 },
		{ name: 'JumpMaster', score: 33 },
		{ name: 'Philosopher', score: 28 },
		{ name: 'Stoic', score: 25 },
		{ name: 'Nihilist', score: 22 },
		{ name: 'Seeker', score: 20 },
		{ name: 'Absurdist', score: 18 },
		{ name: 'Sisyphus', score: 15 },
		{ name: 'Newcomer', score: 12 },
	], // Initialize topScores
};
