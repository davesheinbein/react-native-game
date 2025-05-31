// Hook to handle narration triggers and state
import { useState } from 'react';

// This hook is now obsolete. Use useGameStore from game/state/useGameStore instead.
export function useNarration() {
	const [narration, setNarration] = useState<string | null>(
		null
	);
	return { narration, setNarration };
}
