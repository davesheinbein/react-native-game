import React from 'react';
import { Button, Text, View } from 'react-native';
import { gameStyles } from '../app/gameStyles';

export function ExistentialChoices({
	showChoices,
	round,
	existentialChoices,
	handleChoice,
}) {
	if (!showChoices) return null;
	const choices =
		existentialChoices[
			(round / 20) % existentialChoices.length | 0
		];
	return (
		<View style={gameStyles.choices}>
			<Text style={gameStyles.choicesTitle}>
				Existential Choice:
			</Text>
			{choices.map((choice) => (
				<Button
					key={choice.label}
					title={choice.label}
					onPress={() => handleChoice(choice.label)}
				/>
			))}
		</View>
	);
}
