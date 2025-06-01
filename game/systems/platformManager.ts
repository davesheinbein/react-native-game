/**
 * Returns the canonical platform shape name for a given number of sides.
 * Used for display, model lookup, and state.
 */
export function getPlatformShapeName(
	sides: number
): string {
	if (sides === 3) return 'Tetrahedron';
	if (sides === 4) return 'Cube';
	if (sides === 6) return 'HexagonalPrism';
	if (sides === 8) return 'OctagonalPrism';
	return `${sides}-gon Prism`;
}

/**
 * Returns a human-friendly description for a given number of sides.
 * Used for narration or tooltips.
 */
export function getPlatformDescription(
	sides: number
): string {
	switch (sides) {
		case 3:
			return 'Tetrahedron (4 triangular faces)';
		case 4:
			return 'Cube (6 square faces)';
		case 6:
			return 'Hexagonal Prism (2 hexagonal faces, 6 rectangular faces)';
		case 8:
			return 'Octagonal Prism (2 octagonal faces, 8 rectangular faces)';
		default:
			return `${sides}-gon Prism`;
	}
}
