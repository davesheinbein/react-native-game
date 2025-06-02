import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { gameStyles } from '../constants/gameStyles';
import { Scoreboard } from './Scoreboard';

interface ScoreEntry {
	name: string;
	score: number;
}

interface ScoreboardTabsProps {
	mode: string;
	setMode: (mode: string) => void;
	localScoresByMode: Record<string, ScoreEntry[]>;
	globalScoresByMode: Record<string, ScoreEntry[]>;
}

export function ScoreboardTabs({
	mode,
	setMode,
	localScoresByMode,
	globalScoresByMode,
}: ScoreboardTabsProps) {
	const [tab, setTab] = useState<'local' | 'global'>(
		'global'
	);

	const localScores = localScoresByMode[mode] || [];
	const globalScores = globalScoresByMode[mode] || [];

	return (
		<View style={{ width: '100%', alignItems: 'center' }}>
			{/* Only show Local/Global tabs, not mode tabs or ModeSelector */}
			<View
				style={{ flexDirection: 'row', marginBottom: 10 }}
			>
				<TouchableOpacity
					style={[
						gameStyles.buttonWrapper as any,
						{
							backgroundColor:
								tab === 'local' ? '#ffd600' : '#333',
							padding: 8,
							marginRight: 8,
						},
					]}
					onPress={() => setTab('local')}
				>
					<Text
						style={{
							color: tab === 'local' ? '#222' : '#fff',
							fontWeight: 'bold',
						}}
					>
						Local
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						gameStyles.buttonWrapper as any,
						{
							backgroundColor:
								tab === 'global' ? '#ffd600' : '#333',
							padding: 8,
						},
					]}
					onPress={() => setTab('global')}
				>
					<Text
						style={{
							color: tab === 'global' ? '#222' : '#fff',
							fontWeight: 'bold',
						}}
					>
						Global
					</Text>
				</TouchableOpacity>
			</View>
			<Scoreboard
				scores={
					tab === 'local' ? localScores : globalScores
				}
				title={
					tab === 'local' ?
						`Top 10 Local Streaks (${mode})`
					:	`Top 10 Global Streaks (${mode})`
				}
			/>
		</View>
	);
}
