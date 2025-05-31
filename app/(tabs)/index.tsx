import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { PlatformShape } from '../../components/PlatformShape';
import { StickFigure } from '../../components/StickFigure';
import { existentialChoices } from '../../constants/texts';
import { soundtrackTitles } from '../../game/audio/music';
import {
	fallSound,
	jumpSound,
	milestoneSound,
} from '../../game/audio/soundEffects';
import { getClassicModeState } from '../../game/modes/classic';
import { getEndlessModeState } from '../../game/modes/endless';
import { getManiacModeState } from '../../game/modes/maniac';
import { getPeacefulModeState } from '../../game/modes/peaceful';
import { GameState } from '../../game/state/gameState';
import { useGameStore } from '../../game/state/useGameStore';
import {
	getFallNarration,
	getMilestoneNarration,
} from '../../game/systems/narrationManager';
import { getPlatformShape } from '../../game/systems/platformManager';
import { setCurrentStreak } from '../../game/systems/scoreManager';
import {
	playAmbientSFX,
	useAmbientAudio,
} from '../../hooks/useAmbientAudio';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

const MODES = [
	'Classic',
	'Endless',
	'Maniac',
	'Peaceful',
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
		[5, 10, 20, 40, 80, 100].includes(nextRound);
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

export default function Index() {
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
	} = useGameStore();
	const {
		isMusicPlaying,
		isMusicMuted,
		musicIndex,
		nextTrack,
		setIsMusicPlaying,
		setMusicIndex,
	} = useMusicPlayer();

	const [settingsOpen, setSettingsOpen] =
		React.useState(false);
	const [streak, setStreak] = React.useState(0);

	// Sync streak and high score with scoreManager and state
	useEffect(() => {
		setCurrentStreak(streak);
		if (streak > highScore) {
			setHighScore(streak);
		}
	}, [streak]);

	React.useEffect(() => {
		setMuted(true);
		setSfxEnabled(false);
	}, []);

	// --- AUTOPLAY song-1.wav on mount ---
	const musicStarted = useRef(false);
	useEffect(() => {
		if (!musicStarted.current && !isMusicMuted) {
			setMusicIndex(0); // song-1.wav is index 0
			setIsMusicPlaying(true);
			musicStarted.current = true;
		}
	}, [isMusicMuted, setIsMusicPlaying, setMusicIndex]);

	// --- SOUND EFFECTS: play on jump/fall/milestone ---
	const playSound = playAmbientSFX;

	const [showChoices, setShowChoices] =
		React.useState(false);

	function handleJump(side: number) {
		if (!safeSides.includes(side) && mode !== 'Peaceful') {
			playSound(fallSound, isMuted, sfxEnabled);
			// Only reset streak, do NOT reset high score
			resetGame();
			setNarration(getFallNarration());
			setShowChoices(false);
			setStreak(0);
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
				highScore, // Pass highScore to GameState
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
		setStreak((s) => s + 1); // Increment streak on success
		playSound(jumpSound, isMuted, sfxEnabled);
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

	const handleResetHighScore = () => {
		setHighScore(0);
		setStreak(0);
	};

	return (
		<View style={styles.container}>
			<View
				style={{
					position: 'absolute',
					top: 18,
					right: 18,
					zIndex: 10,
				}}
			>
				{!settingsOpen ?
					<TouchableOpacity
						onPress={() => setSettingsOpen(true)}
						style={{
							padding: 8,
							backgroundColor: 'rgba(34,34,34,0.7)',
							borderRadius: 24,
							elevation: 4,
						}}
					>
						<MaterialCommunityIcons
							name='cog-outline'
							size={32}
							color='#ffd600'
							accessibilityLabel='Open settings'
						/>
					</TouchableOpacity>
				:	<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: 'rgba(34,34,34,0.92)',
							borderRadius: 32,
							paddingVertical: 10,
							paddingHorizontal: 16,
							shadowColor: '#000',
							shadowOpacity: 0.18,
							shadowRadius: 8,
							elevation: 8,
							gap: 18,
							minWidth: 0,
							transform: [
								{ translateX: settingsOpen ? 0 : 200 },
							],
						}}
					>
						<TouchableOpacity
							onPress={() => setSettingsOpen(false)}
							style={{ padding: 6 }}
						>
							<MaterialCommunityIcons
								name='close-circle-outline'
								size={28}
								color='#ffd600'
								accessibilityLabel='Close settings'
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() =>
								setIsMusicPlaying(!isMusicPlaying)
							}
							style={{ padding: 6 }}
						>
							<MaterialCommunityIcons
								name={
									isMusicPlaying ?
										'pause-circle-outline'
									:	'play-circle-outline'
								}
								size={28}
								color='#b2dfdb'
								accessibilityLabel={
									isMusicPlaying ? 'Pause music' : (
										'Play music'
									)
								}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setMuted(!isMuted)}
							style={{ padding: 6 }}
						>
							<MaterialCommunityIcons
								name={
									isMuted ? 'volume-off' : 'volume-high'
								}
								size={28}
								color='#ffd600'
								accessibilityLabel={
									isMuted ? 'Unmute all' : 'Mute all'
								}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() =>
								setSfxEnabled && setSfxEnabled(!sfxEnabled)
							}
							style={{ padding: 6 }}
						>
							<MaterialCommunityIcons
								name={
									sfxEnabled ?
										'bell-ring-outline'
									:	'bell-off-outline'
								}
								size={26}
								color='#ffd600'
								accessibilityLabel={
									sfxEnabled ? 'Disable SFX' : 'Enable SFX'
								}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleResetHighScore}
							style={{ padding: 6 }}
						>
							<MaterialCommunityIcons
								name='restore'
								size={26}
								color='#ffd600'
								accessibilityLabel='Reset High Score'
							/>
						</TouchableOpacity>
					</View>
				}
			</View>
			<Text style={styles.title}>Don't Jump</Text>
			<View
				style={{ alignItems: 'center', marginBottom: 16 }}
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
			<View style={styles.modeRow}>
				{MODES.map((m) => (
					<Button
						key={m}
						title={m}
						color={mode === m ? '#4caf50' : '#333'}
						onPress={() => {
							setMode(m);
							resetGame();
							setShape(getPlatformShape(3));
							setShowChoices(false);
						}}
					/>
				))}
			</View>
			<Text style={styles.round}>Round: {round}</Text>
			<Text style={styles.shape}>
				Platform: {shape} ({sides} sides)
			</Text>
			<Text
				style={styles.music}
				onPress={() => {
					useGameStore.getState().setIsMusicMuted &&
						useGameStore.getState().setIsMusicMuted(false);
					if (isMusicMuted)
						useGameStore.getState().setIsMusicMuted(false);
					if (!isMusicPlaying) setIsMusicPlaying(true);
					nextTrack();
				}}
			>
				🎵 {soundtrackTitles[musicIndex]} (tap to change)
			</Text>
			<Text style={styles.narration}>{narration}</Text>
			<Text style={styles.streak}>
				Streak: {streak} | High Score: {highScore}
			</Text>
			<View style={styles.buttonRow}>
				{Array.from({ length: sides }).map((_, i) => (
					<View key={i} style={styles.buttonWrapper}>
						<Button
							title={`Jump Side ${i + 1}`}
							onPress={() => handleJump(i)}
							color={
								safeSides.includes(i) && mode !== 'Maniac' ?
									'#4caf50'
								:	'#222'
							}
						/>
					</View>
				))}
			</View>
			{/* Existential choices: show only the current set of 3 */}
			{showChoices && (
				<View style={styles.choices}>
					<Text style={styles.choicesTitle}>
						Existential Choice:
					</Text>
					{existentialChoices[
						(round / 20) % existentialChoices.length | 0
					].map((choice) => (
						<Button
							key={choice.label}
							title={choice.label}
							onPress={() => handleChoice(choice.label)}
						/>
					))}
				</View>
			)}
			{cosmeticUnlocks.length > 0 && (
				<View style={styles.cosmetics}>
					<Text style={styles.cosmeticsTitle}>
						Unlocked Cosmetics:
					</Text>
					<FlatList
						data={cosmeticUnlocks}
						keyExtractor={(item) => item}
						renderItem={({ item }) => (
							<Text style={styles.cosmeticItem}>
								{item}
							</Text>
						)}
						horizontal
					/>
				</View>
			)}
			{/* Scoreboard at the bottom */}
			<View style={styles.scoreboardContainer}>
				<Text style={styles.scoreboardTitle}>
					Top 10 Global Streaks
				</Text>
				{GLOBAL_TOP_SCORES.map((entry, idx) => (
					<View
						key={entry.name}
						style={styles.scoreboardRow}
					>
						<Text style={styles.scoreboardRank}>
							{idx + 1}.
						</Text>
						<Text style={styles.scoreboardName}>
							{entry.name}
						</Text>
						<Text style={styles.scoreboardScore}>
							{entry.score}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
	},
	title: {
		color: '#fff',
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	modeRow: {
		flexDirection: 'row',
		marginBottom: 8,
		gap: 4,
	},
	round: { color: '#fff', fontSize: 20, marginBottom: 2 },
	shape: { color: '#aaa', fontSize: 16, marginBottom: 8 },
	music: {
		color: '#b2dfdb',
		fontSize: 14,
		marginBottom: 8,
	},
	narration: {
		color: '#fffa',
		fontSize: 16,
		marginBottom: 16,
		textAlign: 'center',
		minHeight: 40,
	},
	buttonRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginBottom: 12,
	},
	buttonWrapper: { margin: 4, minWidth: 120 },
	choices: {
		backgroundColor: '#222',
		padding: 12,
		borderRadius: 8,
		marginBottom: 12,
	},
	choicesTitle: {
		color: '#fff',
		fontWeight: 'bold',
		marginBottom: 6,
		textAlign: 'center',
	},
	cosmetics: { marginTop: 8, alignItems: 'center' },
	cosmeticsTitle: {
		color: '#fff',
		fontWeight: 'bold',
		marginBottom: 4,
	},
	cosmeticItem: {
		color: '#ffd600',
		marginHorizontal: 6,
		fontSize: 16,
	},
	streak: {
		color: '#ffd600',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	scoreboardContainer: {
		marginTop: 18,
		width: '100%',
		alignItems: 'center',
		backgroundColor: '#222a',
		borderRadius: 10,
		padding: 8,
	},
	scoreboardTitle: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: 4,
	},
	scoreboardRow: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '90%',
		justifyContent: 'space-between',
		paddingVertical: 2,
	},
	scoreboardRank: { color: '#ffd600', width: 24 },
	scoreboardName: { color: '#fff', flex: 1 },
	scoreboardScore: {
		color: '#4caf50',
		fontWeight: 'bold',
		width: 32,
		textAlign: 'right',
	},
});
