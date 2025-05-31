import { create } from 'zustand';
import { GameState, initialState } from './gameState';

interface GameStore extends GameState {
	setMode: (mode: string) => void;
	setShape: (shape: string) => void;
	setSides: (sides: number) => void;
	setSafeSides: (safeSides: number[]) => void;
	setNarration: (narration: string | null) => void;
	setMilestone: (milestone: boolean) => void;
	setCosmeticUnlocks: (cosmeticUnlocks: string[]) => void;
	nextRound: () => void;
	resetGame: () => void;
	// Mute state for audio
	isMuted: boolean;
	setMuted: (muted: boolean) => void;
	// Music playback state
	musicIndex: number;
	setMusicIndex: (
		idx: number | ((idx: number) => number)
	) => void;
	isMusicPlaying: boolean;
	setIsMusicPlaying: (playing: boolean) => void;
	isMusicMuted: boolean;
	setIsMusicMuted: (muted: boolean) => void;
}

export const useGameStore = create<GameStore>(
	(set, get) => ({
		...initialState,
		setMode: (mode) => set({ mode }),
		setShape: (shape) => set({ shape }),
		setSides: (sides) => set({ sides }),
		setSafeSides: (safeSides) => set({ safeSides }),
		setNarration: (narration) => set({ narration }),
		setMilestone: (milestone) => set({ milestone }),
		setCosmeticUnlocks: (cosmeticUnlocks) =>
			set({ cosmeticUnlocks }),
		nextRound: () =>
			set((state) => ({ round: state.round + 1 })),
		resetGame: () => set({ ...initialState }),
		// Audio mute state, default true (music starts muted)
		isMuted: true,
		setMuted: (muted) => set({ isMuted: muted }),
		// Music state
		musicIndex: 0,
		setMusicIndex: (idx) =>
			set((state) => ({
				musicIndex:
					typeof idx === 'function' ?
						idx(state.musicIndex)
					:	idx,
			})),
		isMusicPlaying: false,
		setIsMusicPlaying: (playing) =>
			set({ isMusicPlaying: playing }),
		isMusicMuted: false,
		setIsMusicMuted: (muted) =>
			set({ isMusicMuted: muted }),
	})
);
