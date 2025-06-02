import { ENDLESS_MODE_CONFIG } from '../../constants/config';
import { getRandomSafeSides } from '../systems/jumpManager';

/**
 * Returns the Endless mode state for a given round and current sides.
 * Handles platform progression, safe space rules, and power-up logic per spec.
 *
 * @param round Current round number (1-based)
 * @param currentSides Number of sides on the previous platform
 * @param powerUpsEnabled (optional) Whether power-ups are enabled for this run
 */
export function getEndlessModeState(
	round: number,
	currentSides: number,
	powerUpsEnabled: boolean = ENDLESS_MODE_CONFIG.POWER_UPS_ENABLED
) {
	// --- 1. Platform Progression (Sides) ---
	let sides = currentSides;
	if (
		ENDLESS_MODE_CONFIG.SIDE_MILESTONES.includes(round) &&
		sides < ENDLESS_MODE_CONFIG.MAX_SIDES
	) {
		sides++;
	}
	if (
		round >
			Math.max(...ENDLESS_MODE_CONFIG.SIDE_MILESTONES) &&
		(round -
			Math.max(...ENDLESS_MODE_CONFIG.SIDE_MILESTONES)) %
			ENDLESS_MODE_CONFIG.SIDE_MILESTONE_INTERVAL ===
			0 &&
		sides < ENDLESS_MODE_CONFIG.MAX_SIDES
	) {
		sides++;
	}
	if (sides > ENDLESS_MODE_CONFIG.MAX_SIDES)
		sides = ENDLESS_MODE_CONFIG.MAX_SIDES;

	// --- 2. Safe Space Calculation ---
	let safeCount = ENDLESS_MODE_CONFIG.STARTING_SAFE_SPACES;
	if (
		round >= ENDLESS_MODE_CONFIG.SAFE_SPACES_REDUCE_INTERVAL
	) {
		const reduce = Math.floor(
			round /
				ENDLESS_MODE_CONFIG.SAFE_SPACES_REDUCE_INTERVAL
		);
		safeCount = Math.max(
			ENDLESS_MODE_CONFIG.SAFE_SPACES_MIN,
			ENDLESS_MODE_CONFIG.STARTING_SAFE_SPACES - reduce
		);
	}

	// --- 3. Power-Up Logic ---
	let powerUp: null | { type: string; active: boolean } =
		null;
	if (powerUpsEnabled) {
		const isMilestone =
			ENDLESS_MODE_CONFIG.POWER_UP_MILESTONES.includes(
				round
			);
		const afterMilestones =
			round >
				Math.max(
					...ENDLESS_MODE_CONFIG.POWER_UP_MILESTONES
				) &&
			(round -
				Math.max(
					...ENDLESS_MODE_CONFIG.POWER_UP_MILESTONES
				)) %
				ENDLESS_MODE_CONFIG.POWER_UP_INTERVAL ===
				0;
		if (isMilestone || afterMilestones) {
			const idx = Math.floor(
				Math.random() * ENDLESS_MODE_CONFIG.POWER_UPS.length
			);
			powerUp = {
				type: ENDLESS_MODE_CONFIG.POWER_UPS[idx],
				active: true,
			};
		}
	}

	// --- Disc shape for extreme mode ---
	let shape: string;
	if (sides === 3) shape = 'Tetrahedron';
	else if (sides === 4) shape = 'Cube';
	else if (sides === 6) shape = 'Hexagonal Prism';
	else if (sides === 8) shape = 'Octagonal Prism';
	else if (sides > 8) {
		shape = 'Disc';
		sides = 12; // Use 12 for disc/cylinder
		safeCount = 1;
	} else shape = `${sides}-gon Prism`;

	const safeSides = getRandomSafeSides(sides, safeCount);

	// --- 5. Return state (expandable for narration, power-ups, etc) ---
	return {
		sides,
		safeSides,
		shape,
		powerUp, // null if none this round
	};
}
