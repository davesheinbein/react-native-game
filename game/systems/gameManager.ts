// Centralized game logic and state helpers
import {
	CLASSIC_MODE,
	ENDLESS_MODE,
	MANIAC_MODE,
	MILESTONE_INTERVALS_CLASSIC,
	MILESTONE_INTERVALS_ENDLESS,
	MILESTONE_INTERVALS_MANIAC,
	MILESTONE_INTERVALS_PEACEFUL,
	PEACEFUL_MODE,
} from '../../constants/config';
import { getClassicModeState } from '../modes/classic';
import { getEndlessModeState } from '../modes/endless';
import { getManiacModeState } from '../modes/maniac';
import { getPeacefulModeState } from '../modes/peaceful';
import { GameState } from '../state/gameState';
import {
	getFallNarration,
	getMilestoneNarration,
} from './narrationManager';
import { getPlatformShapeName } from './platformManager';

export function getNextState(
	state: GameState,
	chosenSide: number
): GameState {
	let survived = state.safeSides.includes(chosenSide);
	let nextRound = survived ? state.round + 1 : state.round;
	let milestone =
		survived &&
		getMilestoneIntervals(state.mode).includes(nextRound);
	let narration = null;
	let cosmeticUnlocks = state.cosmeticUnlocks;

	if (!survived) {
		narration = getFallNarration();
	} else if (milestone) {
		narration = getMilestoneNarration(nextRound);
		if (state.mode === 'Classic' && nextRound % 20 === 0) {
			cosmeticUnlocks = [
				...cosmeticUnlocks,
				'Glowing Aura',
			];
		}
	}

	let modeState;
	switch (state.mode) {
		case 'Classic':
			modeState = getClassicModeState(
				nextRound,
				state.sides
			);
			break;
		case 'Endless':
			modeState = getEndlessModeState(
				nextRound,
				state.sides
			);
			break;
		case 'Maniac':
			modeState = getManiacModeState(
				nextRound,
				state.sides
			);
			break;
		case 'Peaceful':
			modeState = getPeacefulModeState(
				nextRound,
				state.sides
			);
			break;
		default:
			modeState = getClassicModeState(
				nextRound,
				state.sides
			);
	}

	return {
		...state,
		round: survived ? nextRound : 1,
		shape: getPlatformShapeName(modeState.sides),
		sides: modeState.sides,
		safeSides: modeState.safeSides,
		narration,
		milestone: !!milestone,
		cosmeticUnlocks,
		topScores: state.topScores,
	};
}

export function getMilestoneIntervals(mode: string) {
	switch (mode) {
		case CLASSIC_MODE:
			return MILESTONE_INTERVALS_CLASSIC;
		case ENDLESS_MODE:
			return MILESTONE_INTERVALS_ENDLESS;
		case MANIAC_MODE:
			return MILESTONE_INTERVALS_MANIAC;
		case PEACEFUL_MODE:
			return MILESTONE_INTERVALS_PEACEFUL;
		default:
			return MILESTONE_INTERVALS_CLASSIC;
	}
}

export interface HandleChoiceParams {
	choice: string;
	mode: string;
	shape: string;
	sides: number;
	safeSides: number[];
	round: number;
	narration: string | null;
	milestone: boolean;
	cosmeticUnlocks: string[];
	streakScore: number;
	highScore: number;
	topScores: { name: string; score: number }[];
	isMuted: boolean;
	sfxEnabled: boolean;
	setSides: (sides: number) => void;
	setSafeSides: (safeSides: number[]) => void;
	setNarration: (narration: string | null) => void;
	setMilestone: (milestone: boolean) => void;
	setCosmeticUnlocks: (cosmeticUnlocks: string[]) => void;
	setShowChoices: (show: boolean) => void;
	playSound: (
		sound: any,
		isMuted: boolean,
		sfxEnabled: boolean
	) => void;
}

export function handleChoice({
	choice,
	mode,
	shape,
	sides,
	safeSides,
	round,
	narration,
	milestone,
	cosmeticUnlocks,
	streakScore,
	highScore,
	topScores,
	isMuted,
	sfxEnabled,
	setSides,
	setSafeSides,
	setNarration,
	setMilestone,
	setCosmeticUnlocks,
	setShowChoices,
	playSound,
}: HandleChoiceParams) {
	if (choice === 'Embrace oblivion') {
		const next = getNextState(
			{
				mode,
				shape,
				sides,
				safeSides,
				round: round + 10,
				narration,
				milestone,
				cosmeticUnlocks,
				streakScore,
				highScore,
				topScores,
			},
			0 // or any valid side, since this is a skip
		);
		setSides(next.sides);
		setSafeSides(next.safeSides);
		setNarration(getMilestoneNarration(round + 10));
		setMilestone(false);
		setShowChoices(false);
	} else if (choice === 'Question meaning') {
		setCosmeticUnlocks([...cosmeticUnlocks, 'Shadow Cat']);
		setShowChoices(false);
	} else {
		setMilestone(false);
		setShowChoices(false);
	}
	playSound &&
		playSound(
			require('../audio/soundEffects').milestoneSound,
			isMuted,
			sfxEnabled
		);
}
