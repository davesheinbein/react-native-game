import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function MainMenu() {
	const router = useRouter();
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: '#fff',
				alignItems: 'center',
				justifyContent: 'center',
				paddingTop: 40,
			}}
		>
			<Text
				style={{
					fontSize: 32,
					fontWeight: '700',
					color: '#222',
					marginBottom: 32,
					letterSpacing: 2,
				}}
			>
				Don't Miss
			</Text>
			<Button
				title='Start Game'
				onPress={() => router.push('/game')}
			/>
			<Button
				title='Profile'
				onPress={() => router.push('/ProfileScreen')}
			/>
			<Button
				title='Achievements'
				onPress={() => router.push('/AchievementsScreen')}
			/>
			<Button
				title='Cosmetics'
				onPress={() => router.push('/CosmeticsScreen')}
			/>
			<Button
				title='How to Play'
				onPress={() => router.push('/RulesScreen')}
			/>
			<Button
				title='Settings'
				onPress={() => router.push('/SettingsScreen')}
			/>
		</View>
	);
}
