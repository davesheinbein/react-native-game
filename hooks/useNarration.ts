// Hook to handle narration triggers and state
import { useState } from 'react';

export function useNarration() {
	const [narration, setNarration] = useState<string | null>(
		null
	);
	return { narration, setNarration };
}
