export function getPeacefulModeState(sides: number) {
	return {
		sides,
		safeSides: Array.from({ length: sides }, (_, i) => i),
	};
}
