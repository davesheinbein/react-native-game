import React from 'react';
import {
	Button,
	Modal,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function OnboardingModal({
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
			animationType='fade'
		>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<Text style={styles.header}>
						Welcome to Don't Miss!
					</Text>
					<Text style={styles.text}>
						Jump, survive, and unlock achievements and
						cosmetics. Compete for the top streaks and have
						fun!
					</Text>
					<Button title="Let's Go!" onPress={onClose} />
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.7)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modal: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 32,
		width: 320,
		alignItems: 'center',
	},
	header: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	text: {
		fontSize: 16,
		marginBottom: 24,
		textAlign: 'center',
	},
});
