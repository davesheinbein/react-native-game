import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { CosmeticUnlocks } from '../components/CosmeticUnlocks';
import { ExistentialChoices } from '../components/ExistentialChoices';
import { JumpButtons } from '../components/JumpButtons';
import { ModeSelector } from '../components/ModeSelector';
import { PlatformShape } from '../components/PlatformShape';
import { Scoreboard } from '../components/Scoreboard';
import { SettingsPanel } from '../components/SettingsPanel';
import { StickFigure } from '../components/StickFigure';
import {
	CLASSIC_MODE,
	ENDLESS_MODE,
	MANIAC_MODE,
	MILESTONE_INTERVALS_CLASSIC,
	MILESTONE_INTERVALS_ENDLESS,
	MILESTONE_INTERVALS_MANIAC,
	MILESTONE_INTERVALS_PEACEFUL,
	PEACEFUL_MODE,
} from '../constants/config';
import { existentialChoices } from '../constants/texts';
import { soundtrackTitles } from '../game/audio/music';
import {
	fallSound,
	jumpSound,
	milestoneSound,
} from '../game/audio/soundEffects';
import { getClassicModeState } from '../game/modes/classic';
import { getEndlessModeState } from '../game/modes/endless';
import { getManiacModeState } from '../game/modes/maniac';
import { getPeacefulModeState } from '../game/modes/peaceful';
import { GameState } from '../game/state/gameState';
import { useGameStore } from '../game/state/useGameStore';
import {
	getFallNarration,
	getMilestoneNarration,
} from '../game/systems/narrationManager';
import { getPlatformShape } from '../game/systems/platformManager';
import { setCurrentStreak } from '../game/systems/scoreManager';
import {
	playAmbientSFX,
	useAmbientAudio,
} from '../hooks/useAmbientAudio';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import {
	playFallNarration,
	playMilestoneNarration,
} from '../hooks/useNarrationPlayer';
import { gameStyles } from './gameStyles';

const MODES = [
	CLASSIC_MODE,
	ENDLESS_MODE,
	MANIAC_MODE,
	PEACEFUL_MODE,
] as const;

type Mode = (typeof MODES)[number];

const GLOBAL_TOP_SCORES = [
	{ name: 'VoidWalker', score: 42 },
	{ name: 'Existentialist', score: 37 },
	{ name: 'JumpMaster', score: 33 },
	{ name: 'Philosopher', score: 28 },
	{ name: 'Stoic', score: 25 },
	{ name: 'Nihilist', score: 22 },
	{ name: 'Seeker', score: 20 },
	{ name: 'Absurdist', score: 18 },
	{ name: 'Sisyphus', score: 15 },
	{ name: 'Newcomer', score: 12 },
];

function getNextState(
	state: GameState,
	chosenSide: number
): GameState {
	let survived = state.safeSides.includes(chosenSide);
	let nextRound = survived ? state.round + 1 : state.round;
	let milestone =
		survived &&
		getMilestoneIntervals(state.mode).includes(nextRound);
	let narration = null;
	let cosmeticUnlocks = state.cosmeticUnlocks;

	if (!survived) {
		narration = getFallNarration();
	} else if (milestone) {
		narration = getMilestoneNarration(nextRound);
		// Cosmetic unlock for 'Question meaning' choice (simulate)
		if (state.mode === 'Classic' && nextRound % 20 === 0) {
			cosmeticUnlocks = [
				...cosmeticUnlocks,
				'Glowing Aura',
			];
		}
	}

	// Determine next platform state
	let modeState;
	switch (state.mode) {
		case 'Classic':
			modeState = getClassicModeState(
				nextRound,
				state.sides
			);
			break;
		case 'Endless':
			modeState = getEndlessModeState(
				nextRound,
				state.sides
			);
			break;
		case 'Maniac':
			modeState = getManiacModeState();
			break;
		case 'Peaceful':
			modeState = getPeacefulModeState(state.sides);
			break;
		default:
			modeState = getClassicModeState(
				nextRound,
				state.sides
			);
	}

	return {
		...state,
		round: survived ? nextRound : 1,
		shape: getPlatformShape(modeState.sides),
		sides: modeState.sides,
		safeSides: modeState.safeSides,
		narration,
		milestone: !!milestone,
		cosmeticUnlocks,
	};
}

function getMilestoneIntervals(mode: string) {
	switch (mode) {
		case CLASSIC_MODE:
			return MILESTONE_INTERVALS_CLASSIC;
		case ENDLESS_MODE:
			return MILESTONE_INTERVALS_ENDLESS;
		case MANIAC_MODE:
			return MILESTONE_INTERVALS_MANIAC;
		case PEACEFUL_MODE:
			return MILESTONE_INTERVALS_PEACEFUL;
		default:
			return MILESTONE_INTERVALS_CLASSIC;
	}
}

export default function GamePage() {
	useAmbientAudio();
	const {
		mode,
		shape,
		sides,
		safeSides,
		round,
		narration,
		milestone,
		cosmeticUnlocks,
		setMode,
		setShape,
		setSides,
		setSafeSides,
		setNarration,
		setMilestone,
		setCosmeticUnlocks,
		nextRound,
		resetGame,
		isMuted,
		setMuted,
		sfxEnabled,
		setSfxEnabled,
		highScore,
		setHighScore,
		streakScore,
		setStreakScore,
		settingsOpen,
		setSettingsOpen,
		showChoices,
		setShowChoices,
		musicIndex,
		setMusicIndex,
		isMusicPlaying,
		setIsMusicPlaying,
		isMusicMuted,
		setIsMusicMuted,
	} = useGameStore();
	const { nextTrack } = useMusicPlayer();

	useEffect(() => {
		setCurrentStreak(streakScore);
		if (streakScore > highScore) {
			setHighScore(streakScore);
		}
	}, [streakScore]);

	React.useEffect(() => {
		setMuted(true);
		setSfxEnabled(false);
	}, []);

	const musicStarted = useRef(false);
	useEffect(() => {
		if (!musicStarted.current && !isMusicMuted) {
			setMusicIndex(0);
			setIsMusicPlaying(true);
			musicStarted.current = true;
		}
	}, [isMusicMuted, setIsMusicPlaying, setMusicIndex]);

	const playSound = playAmbientSFX;

	function handleJump(side: number) {
		if (!safeSides.includes(side) && mode !== 'Peaceful') {
			playSound(fallSound, isMuted, sfxEnabled);
			playFallNarration();
			resetGame();
			setNarration(getFallNarration());
			setShowChoices(false);
			setStreakScore(0);
			return;
		}
		const next = getNextState(
			{
				mode,
				shape,
				sides,
				safeSides,
				round,
				narration,
				milestone,
				cosmeticUnlocks,
				streakScore,
				highScore,
			},
			side
		);
		setMode(next.mode);
		setShape(next.shape);
		setSides(next.sides);
		setSafeSides(next.safeSides);
		setNarration(next.narration);
		setMilestone(next.milestone);
		setCosmeticUnlocks(next.cosmeticUnlocks);
		setShowChoices(next.milestone);
		setStreakScore(streakScore + 1);
		playSound(jumpSound, isMuted, sfxEnabled);
		if (next.milestone) {
			const intervals = getMilestoneIntervals(mode);
			const streakValue = streakScore + 1;
			const milestoneIndex = intervals.findIndex(
				(v) => v === streakValue
			);
			if (milestoneIndex !== -1) {
				playMilestoneNarration(milestoneIndex);
			}
		}
	}

	function handleChoice(choice: string) {
		if (choice === 'Embrace oblivion') {
			let nextRound = round + 10;
			let modeState;
			switch (mode) {
				case 'Classic':
					modeState = getClassicModeState(nextRound, sides);
					break;
				case 'Endless':
					modeState = getEndlessModeState(nextRound, sides);
					break;
				case 'Maniac':
					modeState = getManiacModeState();
					break;
				case 'Peaceful':
					modeState = getPeacefulModeState(sides);
					break;
				default:
					modeState = getClassicModeState(nextRound, sides);
			}
			setSides(modeState.sides);
			setSafeSides(modeState.safeSides);
			setNarration(getMilestoneNarration(nextRound));
			setMilestone(false);
			setShowChoices(false);
		} else if (choice === 'Question meaning') {
			setCosmeticUnlocks([
				...cosmeticUnlocks,
				'Shadow Cat',
			]);
			setNarration(
				'You stare into the void. The void stares back. You unlock a Shadow Cat.'
			);
			setMilestone(false);
			setShowChoices(false);
		} else {
			setMilestone(false);
			setShowChoices(false);
		}
		playSound(milestoneSound, isMuted, sfxEnabled);
	}

	useEffect(() => {
		if (milestone && narration) {
			const intervals = getMilestoneIntervals(mode);
			const milestoneIndex = intervals.findIndex(
				(v) => v === round
			);
			if (milestoneIndex !== -1) {
				playMilestoneNarration(milestoneIndex);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [milestone, narration]);

	const handleResetHighScore = () => {
		setHighScore(0);
		setStreakScore(0);
	};

	return (
		<View
			style={gameStyles.container}
			className='main-container'
		>
			<SettingsPanel
				isOpen={settingsOpen}
				onOpen={() => setSettingsOpen(true)}
				onClose={() => setSettingsOpen(false)}
				isMusicPlaying={isMusicPlaying}
				onToggleMusic={() =>
					setIsMusicPlaying(!isMusicPlaying)
				}
				onNextTrack={nextTrack}
				isMuted={isMuted}
				onToggleMute={() => setMuted(!isMuted)}
				sfxEnabled={sfxEnabled}
				onToggleSfx={() => setSfxEnabled(!sfxEnabled)}
				onResetHighScore={handleResetHighScore}
				musicTitle={soundtrackTitles[musicIndex]}
				musicIndex={musicIndex}
			/>
			<Text style={gameStyles.title}>Don't Jump</Text>
			<View
				style={{ alignItems: 'center', marginBottom: 16 }}
				className='canvas-container'
			>
				<Canvas
					style={{
						width: 180,
						height: 180,
						backgroundColor: 'transparent',
						borderRadius: 16,
					}}
					camera={{
						position: [0, 3, 7],
						fov: 50,
						near: 0.1,
						far: 100,
					}}
					shadows={false}
					frameloop='demand'
				>
					<ambientLight intensity={1.0} />
					<directionalLight
						position={[5, 10, 7]}
						intensity={1.0}
						castShadow={false}
					/>
					<StickFigure />
				</Canvas>
				<Canvas
					style={{
						width: 180,
						height: 180,
						backgroundColor: 'transparent',
						borderRadius: 16,
					}}
					camera={{
						position: [0, 3, 7],
						fov: 50,
						near: 0.1,
						far: 100,
					}}
					shadows={false}
					frameloop='demand'
				>
					<PlatformShape sides={sides} />
				</Canvas>
			</View>
			<ModeSelector
				mode={mode}
				setMode={setMode}
				resetGame={resetGame}
				setShape={setShape}
				setShowChoices={setShowChoices}
				MODES={MODES}
				getPlatformShape={getPlatformShape}
			/>
			<Text style={gameStyles.round}>Round: {round}</Text>
			<Text style={gameStyles.shape}>
				Platform: {shape} ({sides} sides)
			</Text>
			<Text style={gameStyles.narration}>{narration}</Text>
			<Text style={gameStyles.streak}>
				Streak: {streakScore} | High Score: {highScore}
			</Text>
			<JumpButtons
				sides={sides}
				safeSides={safeSides}
				mode={mode}
				handleJump={handleJump}
			/>
			<ExistentialChoices
				showChoices={showChoices}
				round={round}
				existentialChoices={existentialChoices}
				handleChoice={handleChoice}
			/>
			<CosmeticUnlocks cosmeticUnlocks={cosmeticUnlocks} />
			<Scoreboard scores={GLOBAL_TOP_SCORES} />
		</View>
	);
}
