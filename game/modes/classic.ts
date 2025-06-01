import { CLASSIC_MODE_CONFIG } from '../../constants/config';
import { getRandomSafeSides } from '../systems/jumpManager';

/**
 * Returns the Classic mode state for a given round and current sides.
 * Handles platform progression, safe space rules, and power-up stubs per spec.
 *
 * @param round Current round number (1-based)
 * @param currentSides Number of sides on the previous platform
 * @param powerUpsEnabled (optional) Whether power-ups are enabled for this run
 */
export function getClassicModeState(
	round: number,
	currentSides: number,
	powerUpsEnabled: boolean = CLASSIC_MODE_CONFIG.POWER_UPS_ENABLED
) {
	// --- 1. Platform Progression (Sides) ---
	let sides = currentSides;
	for (const m of CLASSIC_MODE_CONFIG.MILESTONES) {
		if (
			round === m &&
			sides < CLASSIC_MODE_CONFIG.MAX_SIDES
		) {
			sides++;
		}
	}
	if (sides > CLASSIC_MODE_CONFIG.MAX_SIDES)
		sides = CLASSIC_MODE_CONFIG.MAX_SIDES;

	// --- 2. Safe Space Calculation ---
	let safeCount: number;
	if (round <= 100) {
		// Proportional to sides, min 2
		safeCount =
			CLASSIC_MODE_CONFIG.SAFE_SPACES_PROPORTION(sides);
		safeCount = Math.max(
			CLASSIC_MODE_CONFIG.SAFE_SPACES_MIN,
			safeCount
		);
	} else {
		// After 100, decrease by 1 every 10 rounds, min 1
		const baseSafe =
			CLASSIC_MODE_CONFIG.SAFE_SPACES_PROPORTION(sides);
		const decrease = Math.floor(
			(round - 100) /
				CLASSIC_MODE_CONFIG.SAFE_SPACES_DECREASE_INTERVAL
		);
		safeCount = Math.max(
			CLASSIC_MODE_CONFIG.SAFE_SPACES_MIN_AFTER_100,
			baseSafe - decrease
		);
	}

	// --- 3. Edge Case: Never below 1 safe space ---
	if (safeCount < 1) safeCount = 1;

	// --- 4. Power-Up Logic (Stub) ---
	let powerUp: null | { type: string; active: boolean } =
		null;
	if (
		powerUpsEnabled &&
		round % CLASSIC_MODE_CONFIG.POWER_UP_INTERVAL === 0
	) {
		// Pick a random power-up type for now (future: weighted, context-aware)
		const idx = Math.floor(
			Math.random() * CLASSIC_MODE_CONFIG.POWER_UPS.length
		);
		powerUp = {
			type: CLASSIC_MODE_CONFIG.POWER_UPS[idx],
			active: true,
		};
		// (Future: ensure only 1 per round, spawn on a random safe side)
	}

	// --- 5. Safe Sides Selection ---
	const safeSides = getRandomSafeSides(sides, safeCount);

	// --- 6. Return state (expandable for narration, power-ups, etc) ---
	return {
		sides,
		safeSides,
		powerUp, // null if none this round
	};
}
