import { MAX_SIDES_PEACEFUL } from '../../constants/config';

export function getPeacefulModeState(
	sides: number = MAX_SIDES_PEACEFUL
) {
	return {
		sides,
		safeSides: Array.from({ length: sides }, (_, i) => i),
	};
}
