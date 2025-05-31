import { getRandomSafeSides } from '../systems/jumpLogic';

export function getClassicModeState(
	round: number,
	currentSides: number
) {
	// Increase sides at milestones, max 8
	const milestones = [5, 10, 20, 40, 80, 100];
	let sides = currentSides;
	for (const m of milestones) {
		if (round === m && sides < 8) sides++;
	}
	// After 100, decrease safe sides
	let minSafe = 1;
	let safeCount = Math.max(
		minSafe,
		Math.floor(sides - Math.log2(round + 1))
	);
	if (round > 100)
		safeCount = Math.max(
			1,
			safeCount - Math.floor((round - 100) / 10)
		);
	const safeSides = getRandomSafeSides(sides, safeCount);
	return { sides, safeSides };
}
