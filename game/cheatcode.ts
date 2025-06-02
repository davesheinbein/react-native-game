// Cheatcode utility for toggling safe side visibility in Platform
// Usage: import { useCheatSafeSides } from '../game/cheatcode';
// Call useCheatSafeSides() in your Platform or game component

import { useEffect, useState } from 'react';

// Global (module-level) toggle for safe side visibility
let _showSafeSides = false;
const listeners: Array<(val: boolean) => void> = [];

export function setShowSafeSidesCheat(val: boolean) {
	_showSafeSides = val;
	listeners.forEach((cb) => cb(val));
}

export function getShowSafeSidesCheat() {
	return _showSafeSides;
}

// React hook for components to subscribe to cheat state
export function useCheatSafeSides(): [
	boolean,
	(val: boolean) => void,
] {
	const [show, setShow] = useState(_showSafeSides);
	// Subscribe/unsubscribe to global changes
	useEffect(() => {
		listeners.push(setShow);
		return () => {
			const idx = listeners.indexOf(setShow);
			if (idx !== -1) listeners.splice(idx, 1);
		};
	}, []);
	return [show, setShowSafeSidesCheat];
}

// Optionally, expose a keyboard shortcut for dev/testing (web only)
if (typeof window !== 'undefined') {
	window.addEventListener('keydown', (e) => {
		if (e.ctrlKey && e.key === 's') {
			setShowSafeSidesCheat(!_showSafeSides);
		}
	});
}

// Note: By default, safe jump sides should be rendered with the default color in the UI.
// This cheatcode only toggles the visibility state; color logic should be handled in the rendering component.
