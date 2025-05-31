import React from 'react';
import { Text, View } from 'react-native';
import { gameStyles } from '../app/gameStyles';

export function Scoreboard({ scores }) {
	return (
		<View style={gameStyles.scoreboardContainer}>
			<Text style={gameStyles.scoreboardTitle}>
				Top 10 Global Streaks
			</Text>
			{scores.map((entry, idx) => (
				<View
					key={entry.name}
					style={gameStyles.scoreboardRow}
				>
					<Text style={gameStyles.scoreboardRank}>
						{idx + 1}.
					</Text>
					<Text style={gameStyles.scoreboardName}>
						{entry.name}
					</Text>
					<Text style={gameStyles.scoreboardScore}>
						{entry.score}
					</Text>
				</View>
			))}
		</View>
	);
}
