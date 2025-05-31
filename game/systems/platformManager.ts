export function getPlatformShape(sides: number) {
	if (sides === 3) return 'Triangle';
	if (sides === 4) return 'Square';
	if (sides === 6) return 'Hexagon';
	if (sides === 8) return 'Octagon';
	return `${sides}-gon`;
}
