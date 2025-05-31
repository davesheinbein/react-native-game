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
