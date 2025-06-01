import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { gameStyles } from '../constants/gameStyles';
import { Scoreboard } from './Scoreboard';

export function ScoreboardTabs({
	localScores,
	globalScores,
}) {
	const [tab, setTab] = useState<'local' | 'global'>(
		'global'
	);

	return (
		<View style={{ width: '100%', alignItems: 'center' }}>
			<View
				style={{ flexDirection: 'row', marginBottom: 10 }}
			>
				<TouchableOpacity
					style={[
						gameStyles.buttonWrapper,
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
						gameStyles.buttonWrapper,
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
						'Top 10 Local Streaks'
					:	'Top 10 Global Streaks'
				}
			/>
		</View>
	);
}
