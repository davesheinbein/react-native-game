// Game config values
export const MAX_SIDES_CLASSIC = 8;
export const MAX_SIDES_ENDLESS = 12; // No limit in Endless mode
export const MAX_SIDES_MANIAC = 8;
export const MAX_SIDES_PEACEFUL = 4;

// comes available at start of game
export const MILESTONE_INTERVALS_CLASSIC = [
	5, 10, 20, 40, 80, 100, 200, 400, 800, 1600, 3200, 6400,
	12800, 25600, 51200, 102400, 204800, 409600,
];

// Becomes available after completing the first 50 levels in Classic mode
export const MILESTONE_INTERVALS_ENDLESS = [
	50, 100, 200, 400, 800, 1000, 1500, 2000, 3000, 4000,
	5000, 6000, 7000, 8000, 9000, 10000,
];

// Becomes available after completing the first 100 levels in Classic mode
export const MILESTONE_INTERVALS_MANIAC = [
	500, 1000, 2000, 4000, 8000, 10000, 15000, 20000, 30000,
	40000, 50000, 60000,
];

// Becomes available after completing the first 20 levels in Classic mode
export const MILESTONE_INTERVALS_PEACEFUL = [
	5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130,
	140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240,
	250, 260, 270, 280, 290, 300,
];
export const CLASSIC_MODE = 'Classic';
export const ENDLESS_MODE = 'Endless';
export const MANIAC_MODE = 'Maniac';
export const PEACEFUL_MODE = 'Peaceful';

// Future Cosmetic unlocks for players
export const COSMETIC_UNLOCKS = [
	'Glowing Aura',
	'Rainbow Trail',
	'Sparkling Effect',
	'Fire Trail',
	'Ice Trail',
	'Electric Aura',
	'Shadow Effect',
	'Golden Glow',
	'Mystic Fog',
	'Cosmic Dust',
	'Neon Glow',
	'Crystal Shards',
	'Flame Wings',
	'Frost Wings',
];

export const CLASSIC_MODE_CONFIG = {
	MIN_SIDES: 3,
	MAX_SIDES: MAX_SIDES_CLASSIC,
	MILESTONES: MILESTONE_INTERVALS_CLASSIC,
	STARTING_SAFE_SPACES: 2,
	SAFE_SPACES_MIN: 2, // Before round 100
	SAFE_SPACES_MIN_AFTER_100: 1,
	SAFE_SPACES_PROPORTION: (sides: number) =>
		Math.max(2, Math.floor(sides / 2)),
	SAFE_SPACES_DECREASE_INTERVAL: 10, // After 100, decrease every 10 rounds
	POWER_UPS_ENABLED: false, // Set true if toggled at game start
	POWER_UP_INTERVAL: 10,
	POWER_UPS: [
		'Slow Time',
		'Reveal Safe Side',
		'Double Jump',
		'Reverse Sides',
	],
};

export const ENDLESS_MODE_CONFIG = {
	MIN_SIDES: 3,
	MAX_SIDES: MAX_SIDES_ENDLESS,
	MILESTONES: MILESTONE_INTERVALS_ENDLESS,
	SIDE_MILESTONES: [5, 10, 20, 40], // Initial milestones, then every 50 rounds
	SIDE_MILESTONE_INTERVAL: 50, // After 40
	STARTING_SAFE_SPACES: 2,
	SAFE_SPACES_MIN: 1,
	SAFE_SPACES_REDUCE_INTERVAL: 50,
	POWER_UPS_ENABLED: false, // Set true if toggled at game start
	POWER_UP_MILESTONES: [5, 10, 20, 40], // After 40, every 50 rounds
	POWER_UP_INTERVAL: 50, // After 40
	POWER_UPS: [
		'Extra Safe Platform',
		'Slow Time',
		'Void Shield',
		'Reveal Safe Zone',
	],
};

export const MANIAC_MODE_CONFIG = {
	MIN_SIDES: 3,
	MAX_SIDES: MAX_SIDES_MANIAC,
	MILESTONES: MILESTONE_INTERVALS_MANIAC,
	POWER_UPS_ENABLED: true, // default ON for Maniac
	POWER_EVENT_INTERVAL: 5, // Every 5 rounds
	SAFE_SPACES_MIN: 1,
	SAFE_SPACES_MAX: (sides: number, round: number) => {
		if (round <= 20) return Math.min(3, sides - 1);
		if (round <= 50) return Math.min(2, sides - 1);
		return 1;
	},
	SIDE_RANGE: (round: number) => {
		if (round <= 20) return [3, 6];
		if (round <= 50) return [4, MAX_SIDES_MANIAC];
		return [3, MAX_SIDES_MANIAC];
	},
	POWER_UPS: [
		'Extra Safe Zones',
		'Slow Motion Mode',
		'Second Chance',
		'Platform Stabilizer',
		'Double Points Multiplier',
		'Auto-Safe Jump',
	],
	PENALTIES: [
		'Platform Invisibility',
		'Safe Space Flip',
		'Speed Surge',
		'Phantom Side',
		'Extra Unsafe Sides',
		'Narrative Gaslight',
	],
};

export const PEACEFUL_MODE_CONFIG = {
	MIN_SIDES: 3,
	MAX_SIDES: MAX_SIDES_PEACEFUL,
	SHAPE_CYCLE_INTERVAL: 10, // Rounds per side increase if cycling
	POWER_UPS_ENABLED: false, // Toggle at start
	POWER_UPS: [
		{ TYPE: 'Slow Motion', INTERVAL: 15 },
		{ TYPE: 'Double Jump', INTERVAL: 20 },
		{ TYPE: 'Safe Reveal', INTERVAL: 25 },
		{ TYPE: 'Void Fade', INTERVAL: 50 },
	],
	NARRATION_MILESTONES: MILESTONE_INTERVALS_PEACEFUL,
	DANGER_SIDE_MODE: 'random', // or 'patterned' (future)
};

export const MODES = [
	CLASSIC_MODE,
	ENDLESS_MODE,
	MANIAC_MODE,
	PEACEFUL_MODE,
] as const;
