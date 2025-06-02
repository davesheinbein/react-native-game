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
import { ScoreboardTabs } from '../components/ScoreboardTabs';
import { SettingsPanel } from '../components/SettingsPanel';
import { MODES } from '../constants/config';
import { gameStyles } from '../constants/gameStyles';
import { existentialChoices } from '../constants/texts';
import { soundtrackTitles } from '../game/audio/music';
import {
	getStat,
	saveStat,
	updateHighScoreEverywhere,
} from '../game/state/localStats';
import { fetchLeaderboard } from '../game/state/supabaseLeaderboard';
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
import { supabase } from '../utils/supabase';

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

	// --- Supabase Realtime for Global Leaderboard ---
	useEffect(() => {
		let subscription: any;
		async function subscribeToLeaderboard() {
			console.log(
				'[Leaderboard] Subscribing to Supabase leaderboard channel...'
			);
			subscription = supabase
				.channel('public:leaderboard')
				.on(
					'postgres_changes',
					{
						event: '*',
						schema: 'public',
						table: 'leaderboard',
					},
					async () => {
						try {
							console.log(
								'[Leaderboard] Detected change, fetching leaderboard...'
							);
							const scores = await fetchLeaderboard({
								mode,
							});
							console.log(
								'[Leaderboard] Fetched scores (realtime):',
								scores
							);
							if (scores && Array.isArray(scores.data))
								setTopScores(scores.data);
							else if (scores?.error) {
								console.error(
									'Error fetching leaderboard (realtime):',
									scores.error
								);
							}
						} catch (err) {
							console.error(
								'Exception in realtime leaderboard fetch:',
								err
							);
						}
					}
				)
				.subscribe();
		}
		subscribeToLeaderboard();
		return () => {
			if (subscription) subscription.unsubscribe();
		};
	}, [mode, setTopScores]);

	// --- High Score Modal Handlers ---
	const handleHighScoreSubmit = async (name: string) => {
		if (pendingScore == null || !pendingType) return;
		if (pendingType === 'local' || pendingType === 'both') {
			let updated =
				Array.isArray(localScores) ? [...localScores] : [];
			updated = [...updated, { name, score: pendingScore }]
				.sort((a, b) => b.score - a.score)
				.slice(0, 10);
			setLocalScores(updated);
			saveStat('bestStreaks', updated);
		}
		if (
			pendingType === 'global' ||
			pendingType === 'both'
		) {
			// Save to Supabase and update global leaderboard
			await updateHighScoreEverywhere({
				name,
				score: pendingScore,
				mode,
			});
			// Refetch leaderboard after submit
			try {
				console.log(
					'[Leaderboard] Fetching leaderboard after submit...'
				);
				const scores = await fetchLeaderboard({ mode });
				console.log(
					'[Leaderboard] Fetched scores (submit):',
					scores
				);
				if (scores && Array.isArray(scores.data))
					setTopScores(scores.data);
				else if (scores?.error) {
					console.error(
						'Error fetching leaderboard (submit):',
						scores.error
					);
				}
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
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginBottom: 16,
				}}
			>
				{/* Player: Stickman */}
				<View
					style={{ alignItems: 'center', marginLeft: 8 }}
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
						{/* StickFigure at y=0.7, PlatformShape at y=0 */}
						<StickFigure position={[0, 0.7, 0]} scale={1} />
					</Canvas>
				</View>

				{/* Shapes: Platform */}
				<View
					style={{ alignItems: 'center', marginRight: 8 }}
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
							position: [0, 0, 5],
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
						<Platform
							sides={sides || 3}
							mode={mode as any}
							platformSize={1}
							platformHeight={0.8}
						/>
					</Canvas>
				</View>
				{/*  */}
			</View>
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
			<CosmeticUnlocks cosmeticUnlocks={cosmeticUnlocks} />
			<ScoreboardTabs
				localScores={localScores}
				globalScores={topScores}
			/>
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
