import React from 'react';
import { Button, View } from 'react-native';
import { gameStyles } from '../constants/gameStyles';

export function JumpButtons({
	sides,
	safeSides,
	mode,
	handleJump,
}) {
	return (
		<View style={gameStyles.buttonRow}>
			{Array.from({ length: sides }).map((_, i) => (
				<View key={i} style={gameStyles.buttonWrapper}>
					<Button
						title={`Jump Side ${i + 1}`}
						onPress={() => handleJump(i)}
						color={
							safeSides.includes(i) ? '#4caf50' : '#222'
						}
					/>
				</View>
			))}
		</View>
	);
}
