export interface GameState {
	round: number;
	mode: string;
	shape: string;
	sides: number;
	safeSides: number[];
	narration: string | null;
	milestone: boolean;
	cosmeticUnlocks: string[];
}

export const initialState: GameState = {
	round: 1,
	mode: 'Classic',
	shape: 'Triangle',
	sides: 3,
	safeSides: [0],
	narration: null,
	milestone: false,
	cosmeticUnlocks: [],
};
