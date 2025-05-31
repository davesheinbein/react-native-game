import { PlatformShape } from '@/components/PlatformShape';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { StickFigure } from '../../components/StickFigure';
import { soundtrackTitles } from '../../game/audio/music';
import { getClassicModeState } from '../../game/modes/classic';
import { getEndlessModeState } from '../../game/modes/endless';
import { getManiacModeState } from '../../game/modes/maniac';
import { getPeacefulModeState } from '../../game/modes/peaceful';
import { existentialChoices } from '../../game/narration/existentialChoices';
import { GameState } from '../../game/state/gameState';
import { useGameStore } from '../../game/state/useGameStore';
import {
	getFallNarration,
	getMilestoneNarration,
} from '../../game/systems/narrationManager';
import { getPlatformShape } from '../../game/systems/platformManager';
import { useAmbientAudio } from '../../hooks/useAmbientAudio';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

const MODES = [
	'Classic',
	'Endless',
	'Maniac',
	'Peaceful',
] as const;

type Mode = (typeof MODES)[number];

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
	} = useGameStore();

	const {
		isMusicPlaying,
		isMusicMuted,
		musicIndex,
		nextTrack,
		setIsMusicPlaying,
	} = useMusicPlayer();

	const [showChoices, setShowChoices] =
		React.useState(false);

	function handleJump(side: number) {
		if (!safeSides.includes(side) && mode !== 'Peaceful') {
			resetGame();
			setNarration(getFallNarration());
			setShowChoices(false);
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
	}

	return (
		<View style={styles.container}>
			{/* SFX mute button in top right */}
			<View
				style={{
					position: 'absolute',
					top: 18,
					right: 18,
					flexDirection: 'row',
					zIndex: 10,
				}}
			>
				<TouchableOpacity
					style={styles.muteButton}
					onPress={() => setMuted(!isMuted)}
					activeOpacity={0.7}
				>
					<MaterialCommunityIcons
						name={isMuted ? 'volume-off' : 'record'}
						size={28}
						color='#ffd600'
						accessibilityLabel={
							isMuted ? 'Unmute SFX' : 'Mute SFX'
						}
					/>
				</TouchableOpacity>
				{/* Music play/pause button */}
				<TouchableOpacity
					style={[styles.muteButton, { marginLeft: 8 }]}
					onPress={() => setIsMusicPlaying(!isMusicPlaying)}
					activeOpacity={0.7}
				>
					<MaterialCommunityIcons
						name={
							isMusicPlaying ? 'pause-circle' : (
								'play-circle'
							)
						}
						size={28}
						color='#b2dfdb'
						accessibilityLabel={
							isMusicPlaying ? 'Pause music' : 'Play music'
						}
					/>
				</TouchableOpacity>
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
			<Text style={styles.music} onPress={nextTrack}>
				🎵 {soundtrackTitles[musicIndex]} (tap to change)
			</Text>
			<Text style={styles.narration}>{narration}</Text>
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
			{showChoices && (
				<View style={styles.choices}>
					<Text style={styles.choicesTitle}>
						Existential Choice:
					</Text>
					{existentialChoices.map((choice) => (
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
	muteButton: {
		position: 'absolute',
		top: 18,
		right: 18,
		zIndex: 10,
		backgroundColor: '#222b',
		borderRadius: 20,
		padding: 6,
	},
});
