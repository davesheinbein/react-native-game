import {
	addDoc,
	collection,
	limit as fbLimit,
	getDocs,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig'; // Use the updated Firebase config

// --- Leaderboard API (Firebase) ---

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
	const data: any = {
		name,
		score,
		mode,
		created_at: new Date(),
	};
	if (region !== undefined) {
		data.region = region;
	}
	return addDoc(collection(db, 'leaderboard'), data);
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
	let q = query(
		collection(db, 'leaderboard'),
		orderBy('score', 'desc'),
		fbLimit(limit)
	);
	if (mode) q = query(q, where('mode', '==', mode));
	if (region) q = query(q, where('region', '==', region));
	const snapshot = await getDocs(q);
	const data = snapshot.docs.map((doc) => doc.data());
	return { data };
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
	const { data: topScores } = await fetchLeaderboard({
		mode,
		region,
		limit: 10,
	});
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
 * Example table schema for Firestore:
 *
 *   leaderboard (collection)
 *     └── leaderboard (document)
 *         ├── name: string
 *         ├── score: number
 *         ├── mode: string
 *         ├── region: string (optional)
 *         └── created_at: timestamp
 */
