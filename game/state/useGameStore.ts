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
	// SFX enabled state
	sfxEnabled: boolean;
	setSfxEnabled: (enabled: boolean) => void;
	// High score state
	streakScore: number;
	setStreakScore: (score: number) => void;
	highScore: number;
	setHighScore: (score: number) => void;
	// Settings UI state
	settingsOpen: boolean;
	setSettingsOpen: (open: boolean) => void;
	showChoices: boolean;
	setShowChoices: (show: boolean) => void;
	// Top scores state
	topScores: { name: string; score: number }[];
	setTopScores: (
		scores: { name: string; score: number }[]
	) => void;
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
		resetGame: () => {
			const { highScore, topScores } = get();
			set({ ...initialState, highScore, topScores });
		},
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
		// SFX enabled state
		sfxEnabled: false,
		setSfxEnabled: (enabled) =>
			set({ sfxEnabled: enabled }),
		// Streak score state
		streakScore: 0,
		setStreakScore: (streakScore) => set({ streakScore }),
		// High score state
		highScore: 0,
		setHighScore: (score) => set({ highScore: score }),
		// Settings UI state
		settingsOpen: false,
		setSettingsOpen: (open) => set({ settingsOpen: open }),
		showChoices: false,
		setShowChoices: (show) => set({ showChoices: show }),
		// Top scores state
		topScores: [],
		setTopScores: (scores) => set({ topScores: scores }),
	})
);
