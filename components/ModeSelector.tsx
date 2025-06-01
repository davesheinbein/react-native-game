import React from 'react';
import { Button, View } from 'react-native';
import { gameStyles } from '../constants/gameStyles';

export function ModeSelector({
	mode,
	setMode,
	resetGame,
	setShape,
	setShowChoices,
	MODES,
	getPlatformShape,
	setHighScore,
}: {
	mode: string;
	setMode: (mode: string) => void;
	resetGame: () => void;
	setShape: (shape: string) => void;
	setShowChoices: (show: boolean) => void;
	MODES: string[];
	getPlatformShape: (sides: number) => string;
	setHighScore: (score: number) => void;
}) {
	return (
		<View style={gameStyles.modeRow}>
			{MODES.map((m: string) => (
				<Button
					key={m}
					title={m}
					color={mode === m ? '#4caf50' : '#333'}
					onPress={() => {
						setMode(m);
						resetGame();
						setHighScore(0); // Reset high score when swapping modes
						setShape(getPlatformShape(3));
						setShowChoices(false);
					}}
				/>
			))}
		</View>
	);
}
