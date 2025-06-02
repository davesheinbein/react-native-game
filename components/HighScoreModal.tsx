import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	FlatList,
	Modal,
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
	mode: string;
	localScores?: { name: string; score: number }[];
	globalScores?: { name: string; score: number }[];
}

export function HighScoreModal({
	visible,
	onSubmit,
	onCancel,
	defaultName = '',
	score,
	isGlobal,
	mode,
	localScores = [],
	globalScores = [],
}: HighScoreModalProps) {
	const [name, setName] = useState(defaultName);
	const [inputFocused, setInputFocused] = useState(false);
	const [submitting, setSubmitting] = useState(false); // Prevent double submit

	React.useEffect(() => {
		if (visible) {
			setName(defaultName);
			setSubmitting(false); // Reset submitting state when modal opens
		}
	}, [visible, defaultName]);

	const handleSubmit = () => {
		if (!name.trim() || submitting) return;
		setSubmitting(true);
		onSubmit(name.trim());
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType='fade'
			onRequestClose={onCancel}
			accessibilityViewIsModal
		>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<TouchableOpacity
						style={styles.closeButton}
						onPress={onCancel}
						accessibilityLabel='Close high score modal'
						accessibilityRole='button'
					>
						<Text style={styles.closeButtonText}>×</Text>
					</TouchableOpacity>
					<Text
						style={styles.header}
						accessibilityRole='header'
					>
						{isGlobal ? 'New Global High Score!' : 'New High Score!'}
					</Text>
					<Text style={styles.subtitle}>
						Enter your name to record your score of {score} in {mode} mode:
					</Text>
					<TextInput
						style={[
							styles.input,
							inputFocused && styles.inputFocused,
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
						onSubmitEditing={handleSubmit}
					/>
					<TouchableOpacity
						style={[
							styles.submitButton,
							(!name.trim() || submitting) && styles.submitButtonDisabled,
						]}
						onPress={handleSubmit}
						disabled={!name.trim() || submitting}
						accessibilityLabel='Submit high score entry'
						accessibilityRole='button'
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{(!name.trim() || submitting) && (
								<Ionicons
									name='lock-closed'
									size={18}
									color='#555'
									style={{ marginRight: 6 }}
								/>
							)}
							<Text
								style={[
									styles.submitButtonText,
									(!name.trim() || submitting) && styles.submitButtonTextDisabled,
								]}
							>
								Submit
							</Text>
						</View>
					</TouchableOpacity>
					{/* Show current top scores for this mode */}
					<View style={{ marginTop: 18, width: '100%' }}>
						<Text style={styles.scoresHeader}>
							Top 10 Local ({mode})
						</Text>
						<FlatList
							data={localScores.slice(0, 10)}
							keyExtractor={(item, idx) => item.name + item.score + idx}
							renderItem={({ item, index }) => (
								<Text style={styles.scoreEntry}>
									{index + 1}. {item.name} - {item.score}
								</Text>
							)}
						/>
						{isGlobal && (
							<>
								<Text style={styles.scoresHeader}>
									Top 10 Global ({mode})
								</Text>
								<FlatList
									data={globalScores.slice(0, 10)}
									keyExtractor={(item, idx) => item.name + item.score + idx}
									renderItem={({ item, index }) => (
										<Text style={styles.scoreEntry}>
											{index + 1}. {item.name} - {item.score}
										</Text>
									)}
								/>
							</>
						)}
					</View>
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
		width: 320,
		minHeight: 240,
		backgroundColor: '#222',
		borderRadius: 16,
		borderWidth: 3,
		borderColor: '#ffd600',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
		position: 'relative',
		shadowColor: '#000',
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 10,
	},
	closeButton: {
		position: 'absolute',
		top: 12,
		right: 12,
		zIndex: 2,
		width: 28,
		height: 28,
		borderRadius: 8, // square with rounded corners
		backgroundColor: '#e57373', // red
		justifyContent: 'center',
		alignItems: 'center',
		padding: 0,
	},
	closeButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		lineHeight: 20,
	},
	header: {
		color: '#ffd600',
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 10,
		marginTop: 28, // Increased from 8 for more spacing below close button
		textAlign: 'center',
	},
	subtitle: {
		color: '#fff',
		fontSize: 16,
		marginBottom: 18,
		textAlign: 'center',
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
		textAlign: 'center',
	},
	inputFocused: {
		borderColor: '#fff',
		shadowColor: '#ffd600',
		shadowOpacity: 0.5,
		shadowRadius: 6,
	},
	submitButton: {
		backgroundColor: '#ffd600',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 32,
		marginBottom: 8,
		opacity: 1,
	},
	submitButtonDisabled: {
		backgroundColor: '#aaa',
		opacity: 0.7,
	},
	submitButtonText: {
		color: '#222',
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center',
	},
	submitButtonTextDisabled: {
		color: '#555',
	},
	scoresHeader: {
		color: '#ffd600',
		fontWeight: 'bold',
		marginBottom: 4,
		textAlign: 'center',
	},
	scoreEntry: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 14,
	},
});
