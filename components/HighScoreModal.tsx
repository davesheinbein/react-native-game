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
	const [modalVisible, setModalVisible] = useState(visible);
	const [animStyle, setAnimStyle] = useState({
		opacity: 0,
		transform: [{ scale: 0.95 }],
	});
	const [inputFocused, setInputFocused] = useState(false);

	React.useEffect(() => {
		if (visible) {
			setModalVisible(true);
			setTimeout(() => {
				setAnimStyle({
					opacity: 1,
					transform: [{ scale: 1 }],
				});
			}, 10);
			setName(defaultName);
		} else {
			setAnimStyle({
				opacity: 0,
				transform: [{ scale: 0.95 }],
			});
			setTimeout(() => setModalVisible(false), 200);
		}
	}, [visible, defaultName]);

	return (
		<Modal
			visible={modalVisible}
			transparent
			animationType='none'
			onRequestClose={onCancel}
			accessibilityViewIsModal
		>
			<Pressable
				style={modalStyles.overlay}
				onPress={onCancel}
				accessibilityLabel='Close high score modal overlay'
				accessibilityRole='button'
			>
				<Pressable
					style={[modalStyles.centeredModal, animStyle]}
					onPress={(e) => e.stopPropagation()}
					accessible
					accessibilityLabel='High score entry dialog'
				>
					<TouchableOpacity
						style={modalStyles.closeButton}
						onPress={onCancel}
						accessibilityLabel='Close high score modal'
						accessibilityRole='button'
					>
						<Text style={modalStyles.closeButtonText}>
							×
						</Text>
					</TouchableOpacity>
					<Text
						style={modalStyles.title}
						accessibilityRole='header'
					>
						{isGlobal ?
							'New Global High Score!'
						:	'New High Score!'}
					</Text>
					<Text style={modalStyles.subtitle}>
						Enter your name to record your score of {score}:
					</Text>
					<TextInput
						style={[
							modalStyles.input,
							inputFocused && modalStyles.inputFocused,
						]}
						value={name}
						onChangeText={setName}
						placeholder='Your Name'
						maxLength={16}
						autoFocus
						returnKeyType='done'
						onFocus={() => setInputFocused(true)}
						onBlur={() => setInputFocused(false)}
						accessibilityLabel='Name input field'
						accessibilityHint='Enter your name to record your score'
						onSubmitEditing={() => {
							if (name.trim()) onSubmit(name);
						}}
					/>
					<View style={modalStyles.buttonRow}>
						<Button
							title='Cancel'
							onPress={onCancel}
							color='#888'
							accessibilityLabel='Cancel high score entry'
						/>
						<View style={{ width: 16 }} />
						<Button
							title='Submit'
							onPress={() => onSubmit(name)}
							disabled={!name.trim()}
							color='#ffd600'
							accessibilityLabel='Submit high score entry'
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
	inputFocused: {
		borderColor: '#fff',
		shadowColor: '#ffd600',
		shadowOpacity: 0.5,
		shadowRadius: 6,
	},
	buttonRow: {
		flexDirection: 'row' as const,
		justifyContent: 'center' as const,
		width: '100%',
		marginTop: 8,
		gap: 0,
	},
});
