import { MAX_SIDES_MANIAC } from '../../constants/config';
import { getRandomSafeSides } from '../systems/jumpLogic';

export function getManiacModeState() {
	const minSides = 3;
	const sides =
		Math.floor(
			Math.random() * (MAX_SIDES_MANIAC - minSides + 1)
		) + minSides; // 3 to MAX_SIDES_MANIAC
	const safeCount = Math.max(
		1,
		Math.floor(Math.random() * sides)
	);
	const safeSides = getRandomSafeSides(sides, safeCount);
	return { sides, safeSides };
}
