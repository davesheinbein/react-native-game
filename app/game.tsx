import { ScoreboardTabs } from '@/components/ScoreboardTabs';
import { StickFigure } from '@/components/StickFigure';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { CosmeticUnlocks } from '../components/CosmeticUnlocks';
import { ExistentialChoices } from '../components/ExistentialChoices';
import { HighScoreModal } from '../components/HighScoreModal';
import { JumpButtons } from '../components/JumpButtons';
import { ModeSelector } from '../components/ModeSelector';
import { Platform } from '../components/Platform';
import { SettingsPanel } from '../components/SettingsPanel';
import { MODES } from '../constants/config';
import { gameStyles } from '../constants/gameStyles';
import { existentialChoices } from '../constants/texts';
import { soundtrackTitles } from '../game/audio/music';
import { fetchLeaderboard } from '../game/state/firebaseConfigLeaderboard';
import {
	getStat,
	saveStat,
	updateHighScoreEverywhere,
} from '../game/state/localStats';
import { useGameStore } from '../game/state/useGameStore';
import {
	getMilestoneIntervals,
	handleChoice as handleChoiceManager,
} from '../game/systems/gameManager';
import { handleJump as handleJumpManager } from '../game/systems/jumpManager';
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

type Mode = (typeof MODES)[number];

export default function Game() {
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
		setTopScores, // <-- add this
	} = useGameStore();
	const { nextTrack } = useMusicPlayer();
	const topScores = useGameStore(
		(state) => state.topScores
	);
	const [localScores, setLocalScores] = React.useState<
		{ name: string; score: number }[]
	>(() => {
		const val = getStat<{ name: string; score: number }[]>(
			'bestStreaks',
			[]
		);
		return Array.isArray(val) ? val : [];
	});

	// --- Multi-mode leaderboard state ---
	type ScoreEntry = { name: string; score: number };
	const [localScoresByMode, setLocalScoresByMode] =
		React.useState<Record<string, ScoreEntry[]>>(() => {
			const obj: Record<string, ScoreEntry[]> = {};
			for (const m of MODES) {
				obj[m] =
					getStat<ScoreEntry[]>(`bestStreaks_${m}`, []) ||
					[];
			}
			return obj;
		});
	const [globalScoresByMode, setGlobalScoresByMode] =
		React.useState<Record<string, ScoreEntry[]>>(() => {
			const obj: Record<string, ScoreEntry[]> = {};
			for (const m of MODES) {
				obj[m] = [];
			}
			return obj;
		});

	// Fetch global leaderboards for all modes on mount
	React.useEffect(() => {
		(async () => {
			for (const m of MODES) {
				try {
					const scores = await fetchLeaderboard({
						mode: m,
					});
					setGlobalScoresByMode(
						(prev: Record<string, ScoreEntry[]>) => ({
							...prev,
							[m]: (scores?.data || []).map(
								(entry: any) => ({
									name: entry.name,
									score: entry.score,
								})
							),
						})
					);
				} catch (err) {
					console.error(
						'Error fetching global leaderboard for',
						m,
						err
					);
				}
			}
		})();
	}, []);

	// --- High Score Modal State ---
	const [showHighScoreModal, setShowHighScoreModal] =
		React.useState(false);
	const [pendingScore, setPendingScore] = React.useState<
		number | null
	>(null);
	const [pendingType, setPendingType] = React.useState<
		'local' | 'global' | 'both' | null
	>(null);
	const [lastMissedScore, setLastMissedScore] =
		React.useState<number | null>(null);

	// --- Detect if a miss happened and if it qualifies for leaderboard ---
	const prevStreakRef = React.useRef(streakScore);
	useEffect(() => {
		// Detect a miss: streakScore reset to 0 but was > 0 before
		if (prevStreakRef.current > 0 && streakScore === 0) {
			const justMissedScore = prevStreakRef.current;
			setLastMissedScore(justMissedScore);
			// Check if qualifies for local/global leaderboard
			let qualifiesLocal = false;
			let qualifiesGlobal = false;
			const localSorted =
				Array.isArray(localScores) ? [...localScores] : [];
			if (
				localSorted.length < 10 ||
				(justMissedScore > 0 &&
					justMissedScore >
						localSorted[localSorted.length - 1]?.score)
			) {
				qualifiesLocal = true;
			}
			const globalSorted =
				Array.isArray(topScores) ? [...topScores] : [];
			if (
				globalSorted.length < 10 ||
				(justMissedScore > 0 &&
					justMissedScore >
						globalSorted[globalSorted.length - 1]?.score)
			) {
				qualifiesGlobal = true;
			}
			if (qualifiesLocal || qualifiesGlobal) {
				setPendingScore(justMissedScore);
				if (qualifiesLocal && qualifiesGlobal)
					setPendingType('both');
				else if (qualifiesLocal) setPendingType('local');
				else setPendingType('global');
				setShowHighScoreModal(true);
			}
		}
		prevStreakRef.current = streakScore;
	}, [streakScore, localScores, topScores]);

	useEffect(() => {
		setCurrentStreak(streakScore);
		if (streakScore > highScore) {
			setHighScore(streakScore);
		}
		// Remove all leaderboard updates here. Only update in handleHighScoreSubmit.
	}, [
		streakScore,
		highScore,
		setCurrentStreak,
		setHighScore,
		topScores,
		setTopScores,
		localScores,
		setLocalScores,
	]);

	const musicStarted = useRef(false);
	useEffect(() => {
		if (!musicStarted.current && !isMusicMuted) {
			setMusicIndex(0);
			setIsMusicPlaying(true);
			musicStarted.current = true;
		}
	}, [isMusicMuted, setIsMusicPlaying, setMusicIndex]);

	const playSound = playAmbientSFX;

	const handleChoice = (choice: string) => {
		handleChoiceManager({
			choice,
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
			topScores,
			isMuted,
			sfxEnabled,
			setSides,
			setSafeSides,
			setNarration,
			setMilestone,
			setCosmeticUnlocks,
			setShowChoices,
			playSound,
		});
	};

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

	const handleJump = (side: number) => {
		handleJumpManager({
			side,
			safeSides,
			mode,
			shape,
			sides,
			round,
			narration,
			milestone,
			cosmeticUnlocks,
			streakScore,
			highScore,
			topScores,
			isMuted,
			sfxEnabled,
			resetGame,
			playFallNarration,
			playMilestoneNarration,
			setMode,
			setShape,
			setSides,
			setSafeSides,
			setNarration,
			setMilestone,
			setCosmeticUnlocks,
			setShowChoices,
			setStreakScore,
			setHighScore,
		});
	};

	// --- High Score Modal Handlers ---
	const handleHighScoreSubmit = async (name: string) => {
		if (pendingScore == null || !pendingType) return;
		const modeKey = mode;
		if (pendingType === 'local' || pendingType === 'both') {
			let updated =
				Array.isArray(localScoresByMode[modeKey]) ?
					[...localScoresByMode[modeKey]]
				:	[];
			updated = [...updated, { name, score: pendingScore }]
				.sort((a, b) => b.score - a.score)
				.slice(0, 10);
			setLocalScoresByMode(
				(prev: Record<string, ScoreEntry[]>) => ({
					...prev,
					[modeKey]: updated,
				})
			);
			saveStat(`bestStreaks_${modeKey}`, updated);
		}
		if (
			pendingType === 'global' ||
			pendingType === 'both'
		) {
			await updateHighScoreEverywhere({
				name,
				score: pendingScore,
				mode,
			});
			try {
				const scores = await fetchLeaderboard({ mode });
				setGlobalScoresByMode(
					(prev: Record<string, ScoreEntry[]>) => ({
						...prev,
						[modeKey]: (scores?.data || []).map(
							(entry: any) => ({
								name: entry.name,
								score: entry.score,
							})
						),
					})
				);
			} catch (err) {
				console.error(
					'Exception in leaderboard fetch after submit:',
					err
				);
			}
		}
		setShowHighScoreModal(false);
		setPendingScore(null);
		setPendingType(null);
		setLastMissedScore(null);
	};

	const handleHighScoreCancel = () => {
		setShowHighScoreModal(false);
		setPendingScore(null);
		setPendingType(null);
		setLastMissedScore(null);
	};

	// Debug: log before rendering PlatformShape
	useEffect(() => {
		console.log(
			'About to render PlatformShape with sides:',
			sides,
			'mode:',
			mode
		);
	}, [sides, mode]);

	console.log(
		'[Game] Rendering PlatformShape with props:',
		{
			sides,
			mode,
			platformSize: 1,
			platformHeight: 0.8,
		}
	);
	console.log(
		'[Game] Current game state for PlatformShape:',
		{
			round,
			shape,
			safeSides,
			streakScore,
			highScore,
			topScores,
			isMuted,
			sfxEnabled,
			settingsOpen,
			showChoices,
			musicIndex,
			isMusicPlaying,
			isMusicMuted,
		}
	);

	const [platformRotation, setPlatformRotation] =
		React.useState(0);
	const platformRef = React.useRef<any>(null);
	const stickFigureRef = React.useRef<any>(null);
	const platformHeight = 0.8;
	// const stickFigureBaseY = -0.45; // lowest y of stickman mesh
	const stickFigureBaseY = 1; // lowest y of stickman mesh
	const stickFigureY =
		platformHeight / 2 + Math.abs(stickFigureBaseY) + 0.05; // 0.05 = small gap

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
				isMuted={isMuted}
				onToggleMute={() => setMuted(!isMuted)}
				sfxEnabled={sfxEnabled}
				onToggleSfx={() => setSfxEnabled(!sfxEnabled)}
				onResetHighScore={handleResetHighScore}
				musicTitle={soundtrackTitles[musicIndex]}
				musicIndex={musicIndex}
			/>
			<Text style={gameStyles.title}>Don't Miss</Text>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginBottom: 16,
				}}
			>
				<View
					style={{ alignItems: 'center' }}
					className='canvas-container'
				>
					<Canvas
						style={{
							width: 250,
							height: 250,
							backgroundColor: 'transparent',
							borderRadius: 16,
						}}
						camera={{
							position: [0, 0.7, 5],
							fov: 50,
							near: 0.1,
							far: 100,
						}}
						shadows={false}
						frameloop='always'
					>
						<color attach='background' args={['#111']} />
						<ambientLight intensity={0.8} />
						<directionalLight
							position={[5, 10, 7]}
							intensity={1.2}
							castShadow={false}
						/>
						<pointLight
							position={[0, 5, 5]}
							intensity={0.5}
						/>
						<group
							position={[0, -1, 0]}
							rotation={[0, platformRotation, 0]}
						>
							<StickFigure
								position={[0, stickFigureY, 0]}
								scale={1}
							/>
							<Platform
								sides={sides || 3}
								mode={mode as any}
								platformSize={1}
								platformHeight={platformHeight}
								onRotationChange={setPlatformRotation}
							/>
						</group>
					</Canvas>
				</View>
				{/*  */}
			</View>
			{/* ModeSelector controls both game and scoreboard mode */}
			<ModeSelector
				mode={mode}
				setMode={setMode}
				resetGame={resetGame}
				setShape={setShape}
				setShowChoices={setShowChoices}
				MODES={[...MODES]}
				getPlatformShape={(sides: number) => {
					const {
						getPlatformShapeName,
					} = require('../game/systems/platformManager');
					return getPlatformShapeName(sides);
				}}
				setHighScore={setHighScore}
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
			<ScoreboardTabs
				mode={mode}
				setMode={setMode}
				localScoresByMode={localScoresByMode}
				globalScoresByMode={globalScoresByMode}
			/>
			<CosmeticUnlocks cosmeticUnlocks={cosmeticUnlocks} />
			<HighScoreModal
				visible={showHighScoreModal}
				onSubmit={handleHighScoreSubmit}
				onCancel={handleHighScoreCancel}
				defaultName={''}
				score={pendingScore}
				isGlobal={
					pendingType === 'global' || pendingType === 'both'
				}
			/>
		</View>
	);
}
