import React from 'react';
import { Button, View } from 'react-native';
import { gameStyles } from '../constants/gameStyles';
import { useCheatSafeSides } from '../game/cheatcode';

interface JumpButtonsProps {
	sides: number;
	safeSides: number[];
	mode: string;
	handleJump: (side: number) => void;
}

export function JumpButtons({
	sides,
	safeSides,
	mode,
	handleJump,
}: JumpButtonsProps) {
	const [showSafeSides] = useCheatSafeSides();
	return (
		<View style={gameStyles.buttonRow}>
			{Array.from({ length: sides }).map((_, i) => (
				<View key={i} style={gameStyles.buttonWrapper}>
					<Button
						title={`Jump Side ${i + 1}`}
						onPress={() => handleJump(i)}
						color={
							showSafeSides && safeSides.includes(i) ?
								'rgb(76, 175, 80)'
							:	'rgb(34, 34, 34)'
						}
					/>
				</View>
			))}
		</View>
	);
}
