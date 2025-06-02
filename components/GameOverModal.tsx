import React from 'react';
import {
	Button,
	Modal,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { getAchievements } from '../game/state/achievements';
import { getCosmetics } from '../game/state/cosmeticUnlocks';

interface Props {
	visible: boolean;
	score: number;
	onClose: () => void;
}

export default function GameOverModal({
	visible,
	score,
	onClose,
}: Props) {
	const achievements = getAchievements().filter(
		(a) => a.unlocked
	);
	const cosmetics = getCosmetics().filter(
		(c) => c.unlocked
	);

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
		>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<Text style={styles.header}>Game Over</Text>
					<Text style={styles.score}>Score: {score}</Text>
					<Text style={styles.section}>
						Unlocked Achievements:
					</Text>
					{achievements.length === 0 ?
						<Text>None</Text>
					:	achievements.map((a) => (
							<Text key={a.id}>🏆 {a.title}</Text>
						))
					}
					<Text style={styles.section}>
						Unlocked Cosmetics:
					</Text>
					{cosmetics.length === 0 ?
						<Text>None</Text>
					:	cosmetics.map((c) => (
							<Text key={c.id}>✨ {c.name}</Text>
						))
					}
					<Button title='Close' onPress={onClose} />
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modal: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 24,
		width: 320,
		alignItems: 'center',
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	score: { fontSize: 20, marginBottom: 16 },
	section: { fontWeight: 'bold', marginTop: 12 },
});
