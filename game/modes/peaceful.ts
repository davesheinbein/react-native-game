import { PEACEFUL_MODE_CONFIG } from '../../constants/config';

/**
 * Returns the Peaceful mode state for a given round and current sides.
 * Handles danger side, shape cycling, and power-up logic per spec.
 * @param round Current round number (1-based)
 * @param currentSides Number of sides on the previous platform
 * @param options Optional config: { shapeCycling: boolean, powerUpsEnabled: boolean }
 */
export function getPeacefulModeState(
	round: number,
	currentSides: number = PEACEFUL_MODE_CONFIG.MAX_SIDES,
	options: {
		shapeCycling?: boolean;
		powerUpsEnabled?: boolean;
	} = {}
) {
	const {
		shapeCycling = false,
		powerUpsEnabled = PEACEFUL_MODE_CONFIG.POWER_UPS_ENABLED,
	} = options;

	// --- 1. Shape Cycling ---
	let sides = currentSides;
	if (shapeCycling) {
		const inc = Math.floor(
			(round - 1) /
				PEACEFUL_MODE_CONFIG.SHAPE_CYCLE_INTERVAL
		);
		sides = Math.min(
			PEACEFUL_MODE_CONFIG.MIN_SIDES + inc,
			PEACEFUL_MODE_CONFIG.MAX_SIDES
		);
	}

	// --- 2. Danger Side Selection ---
	const allSides = Array.from(
		{ length: sides },
		(_, i) => i
	);
	let dangerSide: number;
	if (PEACEFUL_MODE_CONFIG.DANGER_SIDE_MODE === 'random') {
		dangerSide =
			allSides[Math.floor(Math.random() * sides)];
	} else {
		// Patterned mode (future)
		dangerSide =
			allSides[Math.floor(Math.random() * sides)];
	}
	const safeSides = allSides.filter(
		(i) => i !== dangerSide
	);

	// --- 3. Power-Up Logic ---
	let powerUp: null | { type: string; active: boolean } =
		null;
	if (powerUpsEnabled) {
		for (const p of PEACEFUL_MODE_CONFIG.POWER_UPS) {
			if (round % p.INTERVAL === 0) {
				powerUp = { type: p.TYPE, active: true };
				break; // Only one power-up per round
			}
		}
	}

	// --- 4. Narration Trigger (handled externally, but intervals provided) ---
	// PEACEFUL_MODE_CONFIG.NARRATION_MILESTONES

	// --- Disc shape for extreme mode ---
	let shape: string;
	if (sides === 3) shape = 'Tetrahedron';
	else if (sides === 4) shape = 'Cube';
	else if (sides === 6) shape = 'Hexagonal Prism';
	else if (sides === 8) shape = 'Octagonal Prism';
	else if (sides > 8) {
		shape = 'Disc';
		sides = 12; // Use 12 for disc/cylinder
	} else shape = `${sides}-gon Prism`;

	return {
		sides,
		safeSides,
		dangerSide,
		shape,
		powerUp, // null if none this round
	};
}
