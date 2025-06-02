import { playAmbientSFX } from '../../hooks/useAmbientAudio';
import {
	fallSound,
	jumpSound,
} from '../audio/soundEffects';
import { getRandomizeShapeCheat } from '../cheatcode';
import {
	getMilestoneIntervals,
	getNextState,
} from './gameManager';
import { getFallNarration } from './narrationManager';

export interface HandleJumpParams {
	side: number;
	safeSides: number[];
	mode: string;
	shape: string;
	sides: number;
	round: number;
	narration: string | null;
	milestone: boolean;
	cosmeticUnlocks: string[];
	streakScore: number;
	highScore: number;
	topScores: { name: string; score: number }[];
	isMuted: boolean;
	sfxEnabled: boolean;
	resetGame: () => void;
	playFallNarration: () => void;
	playMilestoneNarration: (milestoneIndex: number) => void;
	setMode: (mode: string) => void;
	setShape: (shape: string) => void;
	setSides: (sides: number) => void;
	setSafeSides: (safeSides: number[]) => void;
	setNarration: (narration: string | null) => void;
	setMilestone: (milestone: boolean) => void;
	setCosmeticUnlocks: (cosmeticUnlocks: string[]) => void;
	setShowChoices: (show: boolean) => void;
	setStreakScore: (score: number) => void;
	setHighScore: (score: number) => void; // <-- add this setter
}

export function getRandomSafeSides(
	sides: number,
	safeCount: number
): number[] {
	const arr = Array.from({ length: sides }, (_, i) => i);
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr.slice(0, safeCount);
}

export function handleJump({
	side,
	safeSides,
	mode,
	shape,
	sides,
	round,
	narration,
	milestone,
	cosmeticUnlocks,
	streakScore,
	highScore,
	topScores,
	isMuted,
	sfxEnabled,
	resetGame,
	playFallNarration,
	playMilestoneNarration,
	setMode,
	setShape,
	setSides,
	setSafeSides,
	setNarration,
	setMilestone,
	setCosmeticUnlocks,
	setShowChoices,
	setStreakScore,
	setHighScore, // <-- add this setter
}: HandleJumpParams & {
	setHighScore: (score: number) => void;
}) {
	const playSound = playAmbientSFX;
	console.log(
		'[JumpManager] streakScore:',
		streakScore,
		'highScore:',
		highScore
	);
	if (!safeSides.includes(side) && mode !== 'Peaceful') {
		if (streakScore > highScore) {
			setHighScore(streakScore);
		}
		playSound(fallSound, isMuted, sfxEnabled);
		playFallNarration();
		resetGame();
		setNarration(getFallNarration());
		setShowChoices(false);
		setStreakScore(0);
		return;
	}
	const next = getNextState(
		{
			mode,
			shape,
			sides,
			safeSides,
			round,
			narration: narration ?? '',
			milestone,
			cosmeticUnlocks,
			streakScore,
			highScore,
			topScores,
		} as any, // Type cast for compatibility
		side
	);
	// --- Cheat: Randomize shape after every jump ---
	if (getRandomizeShapeCheat()) {
		// Pick a random shape from the supported set
		const shapes = [
			'Tetrahedron',
			'Cube',
			'Hexagonal Prism',
			'Octagonal Prism',
			'Disc',
		];
		const randomShape =
			shapes[Math.floor(Math.random() * shapes.length)];
		next.shape = randomShape;
		// Optionally, adjust sides for Disc
		if (randomShape === 'Disc') next.sides = 12;
		if (randomShape === 'Tetrahedron') next.sides = 3;
		if (randomShape === 'Cube') next.sides = 4;
		if (randomShape === 'Hexagonal Prism') next.sides = 6;
		if (randomShape === 'Octagonal Prism') next.sides = 8;
	}
	setMode(next.mode);
	setShape(next.shape);
	setSides(next.sides);
	setSafeSides(next.safeSides);
	setNarration(next.narration);
	setMilestone(next.milestone);
	setCosmeticUnlocks(next.cosmeticUnlocks);
	setShowChoices(next.milestone);
	setStreakScore(streakScore + 1);
	playSound(jumpSound, isMuted, sfxEnabled);
	if (next.milestone) {
		const intervals = getMilestoneIntervals(mode);
		const streakValue = streakScore + 1;
		const milestoneIndex = intervals.findIndex(
			(v) => v === streakValue
		);
		if (milestoneIndex !== -1) {
			playMilestoneNarration(milestoneIndex);
		}
	}
}
