import React, { useState } from 'react';
import {
	Button,
	StyleSheet,
	Switch,
	Text,
	View,
} from 'react-native';
import {
	getSettings,
	updateSettings,
} from '../game/state/settings';

export default function SettingsScreen() {
	const [settings, setSettings] = useState(getSettings());

	const handleToggle = (key: string) => {
		const updated = { ...settings, [key]: !settings[key] };
		setSettings(updated);
		updateSettings(updated);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Settings</Text>
			<View style={styles.row}>
				<Text>Music</Text>
				<Switch
					value={settings.musicEnabled}
					onValueChange={() => handleToggle('musicEnabled')}
				/>
			</View>
			<View style={styles.row}>
				<Text>Sound Effects</Text>
				<Switch
					value={settings.sfxEnabled}
					onValueChange={() => handleToggle('sfxEnabled')}
				/>
			</View>
			<View style={styles.row}>
				<Text>Dark Mode</Text>
				<Switch
					value={settings.darkMode}
					onValueChange={() => handleToggle('darkMode')}
				/>
			</View>
			<Button
				title='Reset High Score'
				onPress={() => {
					/* TODO: implement */
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 24,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 18,
	},
});
