import React, { useState } from 'react';
import {
	Button,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

export default function FeedbackModal({
	visible,
	onClose,
	onSubmit,
}: {
	visible: boolean;
	onClose: () => void;
	onSubmit: (msg: string) => void;
}) {
	const [msg, setMsg] = useState('');
	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
		>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<Text style={styles.header}>Send Feedback</Text>
					<TextInput
						style={styles.input}
						value={msg}
						onChangeText={setMsg}
						placeholder='Describe your issue or suggestion...'
						multiline
					/>
					<Button
						title='Send'
						onPress={() => {
							onSubmit(msg);
							setMsg('');
							onClose();
						}}
					/>
					<Button
						title='Cancel'
						onPress={onClose}
						color='#888'
					/>
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
	},
	header: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	input: {
		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 8,
		padding: 8,
		marginBottom: 16,
		minHeight: 60,
	},
});
