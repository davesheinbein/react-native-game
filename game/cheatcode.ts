// Cheatcode utility for toggling safe side visibility in Platform
// Usage: import { useCheatSafeSides } from '../game/cheatcode';
// Call useCheatSafeSides() in your Platform or game component

import React, { useEffect, useState } from 'react';

// Global (module-level) toggle for safe side visibility
// Default to false for initial visibility
let _showSafeSides = true; // Changed to false for development and testing purposes temporaily change before sending out to production
const safeSidesListeners: Array<(val: boolean) => void> =
	[];

export function setShowSafeSidesCheat(val: boolean) {
	_showSafeSides = val;
	safeSidesListeners.forEach((cb) => cb(val));
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
		safeSidesListeners.push(setShow);
		return () => {
			const idx = safeSidesListeners.indexOf(setShow);
			if (idx !== -1) safeSidesListeners.splice(idx, 1);
		};
	}, []);
	return [show, setShowSafeSidesCheat];
}

// --- Cheatcode: Randomize shape after every jump ---
let _randomizeShapeCheat = false;
const randomizeShapeListeners: Array<
	(val: boolean) => void
> = [];
export function setRandomizeShapeCheat(val: boolean) {
	_randomizeShapeCheat = val;
	randomizeShapeListeners.forEach((cb) =>
		cb(_randomizeShapeCheat)
	);
}
export function getRandomizeShapeCheat() {
	return _randomizeShapeCheat;
}
export function useRandomizeShapeCheat(): [
	boolean,
	(val: boolean) => void,
] {
	const [val, setVal] = React.useState(
		_randomizeShapeCheat
	);
	React.useEffect(() => {
		const cb = (v: boolean) => setVal(v);
		randomizeShapeListeners.push(cb);
		return () => {
			const idx = randomizeShapeListeners.indexOf(cb);
			if (idx !== -1)
				randomizeShapeListeners.splice(idx, 1);
		};
	}, []);
	return [val, setRandomizeShapeCheat];
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
