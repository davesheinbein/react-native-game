import React, { useState } from 'react';
import {
	Button,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

interface HighScoreModalProps {
	visible: boolean;
	onSubmit: (name: string) => void;
	onCancel: () => void;
	defaultName?: string;
	score: number | null;
	isGlobal: boolean;
}

export function HighScoreModal({
	visible,
	onSubmit,
	onCancel,
	defaultName = '',
	score,
	isGlobal,
}: HighScoreModalProps) {
	const [name, setName] = useState(defaultName);

	React.useEffect(() => {
		if (visible) setName(defaultName);
	}, [visible, defaultName]);

	return (
		<Modal
			visible={visible}
			transparent
			animationType='fade'
			onRequestClose={onCancel}
		>
			<Pressable
				style={modalStyles.overlay}
				onPress={onCancel}
			>
				<Pressable
					style={modalStyles.centeredModal}
					onPress={(e) => e.stopPropagation()}
				>
					<TouchableOpacity
						style={modalStyles.closeButton}
						onPress={onCancel}
						accessibilityLabel='Close high score modal'
					>
						<Text style={modalStyles.closeButtonText}>
							×
						</Text>
					</TouchableOpacity>
					<Text style={modalStyles.title}>
						{isGlobal ?
							'New Global High Score!'
						:	'New High Score!'}
					</Text>
					<Text style={modalStyles.subtitle}>
						Enter your name to record your score of {score}:
					</Text>
					<TextInput
						style={modalStyles.input}
						value={name}
						onChangeText={setName}
						placeholder='Your Name'
						maxLength={16}
						autoFocus
					/>
					<View style={modalStyles.buttonRow}>
						<Button
							title='Submit'
							onPress={() => onSubmit(name)}
							disabled={!name.trim()}
						/>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const modalStyles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center' as const,
		alignItems: 'center' as const,
	},
	centeredModal: {
		width: 320,
		minHeight: 240,
		backgroundColor: '#222',
		borderRadius: 16,
		borderWidth: 3,
		borderColor: '#ffd600',
		alignItems: 'center' as const,
		justifyContent: 'center' as const,
		padding: 24,
		position: 'relative' as const,
		shadowColor: '#000',
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 10,
	},
	closeButton: {
		position: 'absolute' as const,
		top: 10,
		right: 10,
		zIndex: 2,
		padding: 4,
	},
	closeButtonText: {
		color: '#ffd600',
		fontSize: 28,
		fontWeight: 'bold' as const,
	},
	title: {
		color: '#ffd600',
		fontSize: 22,
		fontWeight: 'bold' as const,
		marginBottom: 10,
		marginTop: 8,
		textAlign: 'center' as const,
	},
	subtitle: {
		color: '#fff',
		fontSize: 16,
		marginBottom: 18,
		textAlign: 'center' as const,
	},
	input: {
		backgroundColor: '#333',
		color: '#fff',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#ffd600',
		paddingHorizontal: 12,
		paddingVertical: 8,
		fontSize: 16,
		width: 200,
		marginBottom: 18,
		textAlign: 'center' as const,
	},
	buttonRow: {
		flexDirection: 'row' as const,
		justifyContent: 'center' as const,
		width: '100%',
		marginTop: 8,
	},
});
