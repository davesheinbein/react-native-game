import { MAX_SIDES_ENDLESS } from '../../constants/config';
import { getRandomSafeSides } from '../systems/jumpLogic';

export function getEndlessModeState(
	round: number,
	currentSides: number
) {
	// Like classic, but no cap
	let sides = Math.min(
		MAX_SIDES_ENDLESS,
		currentSides + Math.floor(Math.log2(round + 1))
	);
	let safeCount = Math.max(
		1,
		Math.floor(sides - Math.log2(round + 1))
	);
	const safeSides = getRandomSafeSides(sides, safeCount);
	return { sides, safeSides };
}
