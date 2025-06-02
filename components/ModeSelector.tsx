import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
		<View
			style={[
				gameStyles.modeRow,
				{
					flexDirection: 'row',
					justifyContent: 'center',
					marginBottom: 10,
				},
			]}
		>
			{MODES.map((m, idx) => (
				<TouchableOpacity
					key={m}
					onPress={() => {
						setMode(m);
						resetGame();
						setHighScore(0);
						setShape(getPlatformShape(3));
						setShowChoices(false);
					}}
					style={{
						backgroundColor:
							mode === m ? '#4caf50' : '#333',
						borderRadius: 12,
						paddingVertical: 8,
						paddingHorizontal: 18,
						marginRight: idx !== MODES.length - 1 ? 8 : 0,
					}}
				>
					<Text
						style={{
							color: '#fff',
							fontWeight: 'bold',
							fontSize: 16,
						}}
					>
						{m}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}
