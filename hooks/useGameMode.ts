// Hook to manage and access current game mode
import { useState } from 'react';

export function useGameMode(initialMode: string) {
	const [mode, setMode] = useState(initialMode);
	return { mode, setMode };
}
