import { supabase } from '../../utils/supabase';

// --- Leaderboard API ---

/**
 * Submit a score to the leaderboard table.
 * @param {Object} params
 * @param {string} params.name - Player name
 * @param {number} params.score - Player score
 * @param {string} params.mode - Game mode (e.g. 'Classic')
 * @param {string} [params.region] - Optional region string
 */
export async function submitScore({
	name,
	score,
	mode,
	region,
}: {
	name: string;
	score: number;
	mode: string;
	region?: string;
}) {
	return supabase
		.from('leaderboard')
		.insert([{ name, score, mode, region }]);
}

/**
 * Fetch top scores from the leaderboard table, optionally filtered by mode and region.
 * @param {Object} params
 * @param {string} [params.mode] - Game mode to filter
 * @param {string} [params.region] - Region to filter
 * @param {number} [params.limit=10] - Number of results to return
 */
export async function fetchLeaderboard({
	mode,
	region,
	limit = 10,
}: {
	mode?: string;
	region?: string;
	limit?: number;
} = {}) {
	let query = supabase.from('leaderboard').select('*');
	if (mode) query = query.eq('mode', mode);
	if (region) query = query.eq('region', region);
	return query
		.order('score', { ascending: false })
		.limit(limit);
}

/**
 * Check if a score qualifies for the global top 10 and submit if so.
 * @param {Object} params
 * @param {string} params.name - Player name
 * @param {number} params.score - Player score
 * @param {string} params.mode - Game mode
 * @param {string} [params.region] - Optional region
 * @returns {Promise<boolean>} true if submitted, false if not
 */
export async function maybeSubmitHighScore({
	name,
	score,
	mode,
	region,
}: {
	name: string;
	score: number;
	mode: string;
	region?: string;
}): Promise<boolean> {
	const { data: topScores, error } = await fetchLeaderboard(
		{ mode, region, limit: 10 }
	);
	if (error) {
		console.error('Error fetching leaderboard:', error);
		return false;
	}
	if (
		!topScores ||
		topScores.length < 10 ||
		score > topScores[topScores.length - 1].score
	) {
		await submitScore({ name, score, mode, region });
		return true;
	}
	return false;
}

/**
 * Example table schema for Supabase (Postgres):
 *
 *   CREATE TABLE leaderboard (
 *     id serial PRIMARY KEY,
 *     name text NOT NULL,
 *     score integer NOT NULL,
 *     mode text NOT NULL,
 *     region text,
 *     created_at timestamp with time zone DEFAULT timezone('utc', now())
 *   );
 */
