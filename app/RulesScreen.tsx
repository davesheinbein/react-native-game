import { useRouter } from 'expo-router';
import React from 'react';
import {
	Button,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function RulesScreen() {
	const router = useRouter();
	return (
		<View style={styles.container}>
			<Text style={styles.header}>How to Play</Text>
			<ScrollView style={styles.scroll}>
				<Text style={styles.text}>
					<b>Don't Miss</b> is a modern, accessible
					platform-jumping game. Your goal is to jump from
					platform to platform, always landing on a{' '}
					<b>safe side</b>.
				</Text>
				<Text style={styles.text}>
					- Each platform is a 3D shape (Tetrahedron, Cube,
					Prism, Disc) with multiple sides.{'\n'}- Only some
					sides are safe! The rest will make you fall.{'\n'}
					- Tap or use keyboard to jump to a side. If you
					land on a safe side, you continue. If not, it's
					game over.{'\n'}- The number of safe sides and
					platform shape changes as your streak increases.
					{'\n'}- Power-ups, penalties, and narration may
					appear as you progress.{'\n'}- Try to beat your
					high score and climb the leaderboards!
				</Text>
				<Text style={styles.text}>
					<b>Tips:</b>
					{'\n'}- Use the cheatcodes menu (Ctrl+S) for
					accessibility options.{'\n'}- Unlock cosmetics and
					achievements as you play.{'\n'}- Each game mode
					(Classic, Endless, Maniac, Peaceful) has unique
					rules and difficulty scaling.
				</Text>
			</ScrollView>
			<Button
				title='Back to Menu'
				onPress={() => router.back()}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#23272f',
		alignItems: 'center',
		paddingTop: 48,
		paddingHorizontal: 16,
	},
	header: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#ffd600',
		marginBottom: 18,
		letterSpacing: 1,
	},
	scroll: {
		width: '100%',
		marginBottom: 24,
	},
	text: {
		fontSize: 16,
		color: '#fff',
		marginBottom: 16,
		lineHeight: 22,
	},
});
