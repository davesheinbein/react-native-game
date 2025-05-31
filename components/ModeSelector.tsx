import React from 'react';
import { Button, View } from 'react-native';
import { gameStyles } from '../app/gameStyles';

export function ModeSelector({
	mode,
	setMode,
	resetGame,
	setShape,
	setShowChoices,
	MODES,
	getPlatformShape,
}) {
	return (
		<View style={gameStyles.modeRow}>
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
	);
}
