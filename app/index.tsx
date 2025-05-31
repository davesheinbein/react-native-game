import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { gameStyles } from './gameStyles';

export default function MainMenu() {
	const router = useRouter();
	return (
		<View style={gameStyles.container}>
			<Text style={gameStyles.title}>Don't Miss</Text>
			<Button
				title='Start Game'
				onPress={() => router.push('/game')}
			/>
		</View>
	);
}
