// Game config values
export const MAX_SIDES_CLASSIC = 8;
export const MAX_SIDES_ENDLESS = 12; // No limit in Endless mode
export const MAX_SIDES_MANIAC = 8;
export const MAX_SIDES_PEACEFUL = 4;

// comes available at start of game
export const MILESTONE_INTERVALS_CLASSIC = [
	5, 10, 20, 40, 80, 100, 200, 400, 800, 1600,
    3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600,
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
