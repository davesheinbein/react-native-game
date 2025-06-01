import React from 'react';
import { Text, View } from 'react-native';
import { gameStyles } from '../constants/gameStyles';

interface ScoreEntry {
	name: string;
	score: number;
}

export function Scoreboard({
	scores,
	title = 'Top 10 Streaks',
}: {
	scores: ScoreEntry[];
	title?: string;
}) {
	return (
		<View style={gameStyles.scoreboardContainer}>
			<Text style={gameStyles.scoreboardTitle}>
				{title}
			</Text>
			{scores.map((entry: ScoreEntry, idx: number) => (
				<View
					key={entry.name + entry.score + idx}
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
