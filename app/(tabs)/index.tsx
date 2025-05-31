import React, { useState } from 'react';
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { soundtrackTitles } from '../../game/audio/music';
import { getClassicModeState } from '../../game/modes/classic';
import { getEndlessModeState } from '../../game/modes/endless';
import { getManiacModeState } from '../../game/modes/maniac';
import { getPeacefulModeState } from '../../game/modes/peaceful';
import { existentialChoices } from '../../game/narration/existentialChoices';
import {
	GameState,
	initialState,
} from '../../game/state/gameState';
import {
	getFallNarration,
	getMilestoneNarration,
} from '../../game/systems/narrationManager';
import { getPlatformShape } from '../../game/systems/platformManager';

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
	const [mode, setMode] = useState<Mode>('Classic');
	const [state, setState] = useState<GameState>({
		...initialState,
		mode,
		shape: getPlatformShape(initialState.sides),
	});
	const [showChoices, setShowChoices] = useState(false);
	const [musicIdx, setMusicIdx] = useState(0);

	// Handle jump
	function handleJump(side: number) {
		if (
			!state.safeSides.includes(side) &&
			state.mode !== 'Peaceful'
		) {
			setState({
				...initialState,
				mode,
				shape: getPlatformShape(initialState.sides),
				narration: getFallNarration(),
			});
			setShowChoices(false);
			return;
		}
		const next = getNextState(state, side);
		setState(next);
		setShowChoices(next.milestone);
	}

	// Handle existential choice
	function handleChoice(choice: string) {
		if (choice === 'Embrace oblivion') {
			// Skip ahead 10 rounds, randomize safe sides
			let nextRound = state.round + 10;
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
			setState({
				...state,
				round: nextRound,
				shape: getPlatformShape(modeState.sides),
				sides: modeState.sides,
				safeSides: modeState.safeSides,
				narration: getMilestoneNarration(nextRound),
				milestone: false,
			});
		} else if (choice === 'Question meaning') {
			// Unlock cosmetic and show deep narration
			setState({
				...state,
				cosmeticUnlocks: [
					...state.cosmeticUnlocks,
					'Shadow Cat',
				],
				narration:
					'You stare into the void. The void stares back. You unlock a Shadow Cat.',
				milestone: false,
			});
		} else {
			// Accept fate: continue as normal
			setState({ ...state, milestone: false });
		}
		setShowChoices(false);
	}

	// Music cycling (mockup)
	function nextTrack() {
		setMusicIdx(
			(idx) => (idx + 1) % soundtrackTitles.length
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Don't Jump</Text>
			<View style={styles.modeRow}>
				{MODES.map((m) => (
					<Button
						key={m}
						title={m}
						color={mode === m ? '#4caf50' : '#333'}
						onPress={() => {
							setMode(m);
							setState({
								...initialState,
								mode: m,
								shape: getPlatformShape(initialState.sides),
							});
							setShowChoices(false);
						}}
					/>
				))}
			</View>
			<Text style={styles.round}>Round: {state.round}</Text>
			<Text style={styles.shape}>
				Platform: {state.shape} ({state.sides} sides)
			</Text>
			<Text style={styles.music} onPress={nextTrack}>
				🎵 {soundtrackTitles[musicIdx]} (tap to change)
			</Text>
			<Text style={styles.narration}>
				{state.narration}
			</Text>
			<View style={styles.buttonRow}>
				{Array.from({ length: state.sides }).map((_, i) => (
					<View key={i} style={styles.buttonWrapper}>
						<Button
							title={`Jump Side ${i + 1}`}
							onPress={() => handleJump(i)}
							color={
								state.safeSides.includes(i) &&
								state.mode !== 'Maniac'
									? '#4caf50'
									: '#222'
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
			{state.cosmeticUnlocks.length > 0 && (
				<View style={styles.cosmetics}>
					<Text style={styles.cosmeticsTitle}>
						Unlocked Cosmetics:
					</Text>
					<FlatList
						data={state.cosmeticUnlocks}
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
});
