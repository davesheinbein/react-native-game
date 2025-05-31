import {
	existentialChoices,
	fallNarrations,
	milestoneNarrations,
} from '../narration/falls';

export function getFallNarration() {
	return fallNarrations[
		Math.floor(Math.random() * fallNarrations.length)
	];
}

export function getMilestoneNarration(round: number) {
	return (
		milestoneNarrations[round] ||
		milestoneNarrations.default
	);
}

export function getExistentialChoice() {
	return existentialChoices[
		Math.floor(Math.random() * existentialChoices.length)
	];
}
