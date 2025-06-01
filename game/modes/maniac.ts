import { MANIAC_MODE_CONFIG } from '../../constants/config';
import { getRandomSafeSides } from '../systems/jumpManager';

// --- Maniac Mode Config ---
// (Moved to centralized config file)

/**
 * Returns the Maniac mode state for a given round.
 * Handles randomized sides, safe spaces, and power-up/penalty triggers per spec.
 * @param round Current round number (1-based)
 * @param prevSides Number of sides on the previous platform
 * @param powerUpsEnabled (optional) Whether power-ups are enabled for this run
 */
export function getManiacModeState(
	round: number,
	prevSides: number,
	powerUpsEnabled: boolean = MANIAC_MODE_CONFIG.POWER_UPS_ENABLED
) {
	// --- 1. Randomize sides per round based on difficulty scaling ---
	const [minSides, maxSides] =
		MANIAC_MODE_CONFIG.SIDE_RANGE(round);
	const sides =
		Math.floor(Math.random() * (maxSides - minSides + 1)) +
		minSides;

	// --- 2. Randomize safe spaces per round ---
	const safeMax = MANIAC_MODE_CONFIG.SAFE_SPACES_MAX(
		sides,
		round
	);
	const safeCount = Math.max(
		MANIAC_MODE_CONFIG.SAFE_SPACES_MIN,
		Math.floor(Math.random() * safeMax) + 1
	);
	const safeSides = getRandomSafeSides(sides, safeCount);

	// --- 3. Power-Up & Penalty Triggers ---
	type ManiacEvent = {
		type: 'power' | 'penalty';
		effect: string;
	};
	let events: ManiacEvent[] = [];
	if (
		powerUpsEnabled &&
		round > 0 &&
		round % MANIAC_MODE_CONFIG.POWER_EVENT_INTERVAL === 0
	) {
		// 1–2 random effects per trigger
		const numEvents = Math.random() < 0.5 ? 1 : 2;
		const allEffects: ManiacEvent[] = [
			...MANIAC_MODE_CONFIG.POWER_UPS.map((e: string) => ({
				type: 'power' as const,
				effect: e,
			})),
			...MANIAC_MODE_CONFIG.PENALTIES.map((e: string) => ({
				type: 'penalty' as const,
				effect: e,
			})),
		];
		for (let i = 0; i < numEvents; i++) {
			const idx = Math.floor(
				Math.random() * allEffects.length
			);
			events.push(allEffects[idx]);
			allEffects.splice(idx, 1); // prevent duplicate
		}
	}

	// --- 4. Return state (expandable for narration, etc) ---
	return {
		sides,
		safeSides,
		events, // Array of power/penalty events this round
	};
}
