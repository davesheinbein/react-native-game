// Audio, difficulty, themes settings screen
import React from 'react';
import { Text, View } from 'react-native';

export default function SettingsScreen() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Text style={{ color: '#fff', fontSize: 24 }}>
				Settings
			</Text>
			<Text style={{ color: '#aaa', marginTop: 8 }}>
				Audio, difficulty, and theme options coming soon.
			</Text>
		</View>
	);
}
