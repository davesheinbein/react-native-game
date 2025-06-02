import React from 'react';
import {
	Button,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function HowToPlayModal({
	visible,
	onClose,
}: {
	visible: boolean;
	onClose: () => void;
}) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
		>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<ScrollView>
						<Text style={styles.header}>How to Play</Text>
						<Text style={styles.text}>
							- Tap the correct side to jump and avoid
							falling!
							{'\n'}- Each mode has unique rules and
							challenges.
							{'\n'}- Unlock achievements and cosmetics by
							reaching milestones.
							{'\n'}- Use the settings to adjust music, SFX,
							and more.
							{'\n'}- Compete for the top streaks on the
							leaderboard!
						</Text>
					</ScrollView>
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
		maxHeight: 400,
	},
	header: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	text: {
		fontSize: 16,
		marginBottom: 18,
	},
});
