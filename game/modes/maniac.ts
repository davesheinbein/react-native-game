import { getRandomSafeSides } from '../systems/jumpLogic';

export function getManiacModeState() {
	const sides = Math.floor(Math.random() * 6) + 3; // 3-8
	const safeCount = Math.max(
		1,
		Math.floor(Math.random() * sides)
	);
	const safeSides = getRandomSafeSides(sides, safeCount);
	return { sides, safeSides };
}
