import React from 'react';
import { View } from 'react-native';
import AchievementsPanel from '../components/AchievementsPanel';

export default function AchievementsScreen() {
	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<AchievementsPanel />
		</View>
	);
}
