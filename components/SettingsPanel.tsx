import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { CheatcodesModal } from './CheatcodesModal';
import GameRulesModal from './GameRulesModal';

/**
 * SettingsPanel: Floating settings menu for music, SFX, mute, and high score reset.
 * - Modernized UI/UX: tooltips, larger touch targets, animated transitions.
 * - Accessibility: labels, roles, and hints for all controls.
 * - Consistent styling and spacing.
 */

export interface SettingsPanelProps {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	isMusicPlaying: boolean;
	onToggleMusic: () => void;
	onNextTrack: () => void;
	isMuted: boolean;
	onToggleMute: () => void;
	sfxEnabled: boolean;
	onToggleSfx: () => void;
	onResetHighScore: () => void;
	musicTitle: string;
	musicIndex: number;
	onHowToPlay: () => void; // NEW: prop for navigating to HowToPlay
}

export function SettingsPanel({
	isOpen,
	onOpen,
	onClose,
	isMusicPlaying,
	onToggleMusic,
	onNextTrack,
	isMuted,
	onToggleMute,
	sfxEnabled,
	onToggleSfx,
	onResetHighScore,
	musicTitle,
	musicIndex,
	onHowToPlay, // NEW: destructure the onHowToPlay prop
}: SettingsPanelProps) {
	const [cheatModalOpen, setCheatModalOpen] =
		React.useState(false);
	const [rulesModalOpen, setRulesModalOpen] =
		React.useState(false);
	const [resetConfirmOpen, setResetConfirmOpen] =
		React.useState(false); // NEW: state for reset confirmation

	const handleResetPress = () => setResetConfirmOpen(true);
	const handleResetConfirm = () => {
		onResetHighScore();
		setResetConfirmOpen(false);
	};
	const handleResetCancel = () =>
		setResetConfirmOpen(false);

	return (
		<View style={styles.panelRoot}>
			{!isOpen ?
				<TouchableOpacity
					onPress={onOpen}
					accessibilityRole='button'
					accessibilityLabel='Open settings'
					style={styles.iconBtn}
				>
					<MaterialCommunityIcons
						name='cog-outline'
						size={32}
						color='#ffd600'
					/>
				</TouchableOpacity>
			:	<View style={styles.panelOpen}>
					{/* Close button */}
					<TouchableOpacity
						onPress={onClose}
						accessibilityRole='button'
						accessibilityLabel='Close settings'
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons
							name='close-circle-outline'
							size={32}
							color='#ffd600'
						/>
					</TouchableOpacity>
					{/* Music play/pause */}
					<TouchableOpacity
						onPress={onToggleMusic}
						accessibilityRole='button'
						accessibilityLabel={
							isMusicPlaying ? 'Pause music' : 'Play music'
						}
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons
							name={
								isMusicPlaying ?
									'pause-circle-outline'
								:	'play-circle-outline'
							}
							size={28}
							color='#b2dfdb'
						/>
					</TouchableOpacity>
					{/* Next track */}
					<TouchableOpacity
						onPress={onNextTrack}
						accessibilityRole='button'
						accessibilityLabel='Change music track'
						style={styles.iconBtn}
					>
						<Text style={styles.musicTitle}>
							{musicTitle} (tap to change)
						</Text>
					</TouchableOpacity>
					{/* Mute toggle */}
					<TouchableOpacity
						onPress={onToggleMute}
						accessibilityRole='button'
						accessibilityLabel={
							isMuted ? 'Unmute all' : 'Mute all'
						}
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons
							name={isMuted ? 'volume-off' : 'volume-high'}
							size={28}
							color='#ffd600'
						/>
					</TouchableOpacity>
					{/* SFX toggle */}
					<TouchableOpacity
						onPress={onToggleSfx}
						accessibilityRole='button'
						accessibilityLabel={
							sfxEnabled ? 'Disable SFX' : 'Enable SFX'
						}
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons
							name={
								sfxEnabled ?
									'bell-ring-outline'
								:	'bell-off-outline'
							}
							size={26}
							color='#ffd600'
						/>
					</TouchableOpacity>
					{/* Reset high score with confirmation modal */}
					<TouchableOpacity
						onPress={handleResetPress}
						accessibilityRole='button'
						accessibilityLabel='Reset High Score'
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons
							name='restore'
							size={26}
							color='#ffd600'
						/>
					</TouchableOpacity>
					<Modal
						visible={resetConfirmOpen}
						animationType='fade'
						transparent
						onRequestClose={handleResetCancel}
					>
						<View style={styles.modalOverlay}>
							<View style={styles.confirmModal}>
								<Text style={styles.confirmTitle}>
									Reset High Score?
								</Text>
								<Text style={styles.confirmText}>
									Are you sure you want to reset all local
									high scores? This cannot be undone.
								</Text>
								<View style={styles.confirmActions}>
									<Pressable
										style={styles.confirmBtn}
										onPress={handleResetCancel}
									>
										<Text style={styles.confirmBtnText}>
											Cancel
										</Text>
									</Pressable>
									<Pressable
										style={[
											styles.confirmBtn,
											styles.confirmBtnDanger,
										]}
										onPress={handleResetConfirm}
									>
										<Text
											style={[
												styles.confirmBtnText,
												styles.confirmBtnDangerText,
											]}
										>
											Reset
										</Text>
									</Pressable>
								</View>
							</View>
						</View>
					</Modal>
					{/* Cheatcodes button with tooltip */}
					<TouchableOpacity
						onPress={() => setCheatModalOpen(true)}
						accessibilityRole='button'
						accessibilityLabel='Open cheatcodes menu'
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons
							name='code-braces'
							size={26}
							color='#ffd600'
						/>
						<Text style={styles.cheatLabel}>
							Cheatcodes
						</Text>
					</TouchableOpacity>
					{/* How to Play button */}
					<TouchableOpacity
						onPress={onHowToPlay}
						accessibilityRole='button'
						accessibilityLabel='How to play instructions'
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons
							name='help-circle-outline'
							size={26}
							color='#ffd600'
						/>
						<Text style={styles.cheatLabel}>
							How to Play
						</Text>
					</TouchableOpacity>
				</View>
			}
			<CheatcodesModal
				visible={cheatModalOpen}
				onClose={() => setCheatModalOpen(false)}
			/>
			{isOpen && (
				<GameRulesModal
					visible={rulesModalOpen}
					onClose={() => setRulesModalOpen(false)}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	panelRoot: {
		position: 'absolute',
		top: 18,
		right: 18,
		zIndex: 10,
	},
	panelOpen: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(34,34,34,0.97)',
		borderRadius: 32,
		paddingVertical: 12,
		paddingHorizontal: 18,
		shadowColor: '#000',
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 8,
		gap: 18,
		minWidth: 0,
	},
	iconBtn: {
		padding: 8,
		marginLeft: 4,
		borderRadius: 16,
		backgroundColor: 'rgba(34,34,34,0.7)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	musicTitle: {
		color: '#ffd600',
		fontSize: 14,
		marginBottom: 2,
	},
	cheatLabel: {
		color: '#ffd600',
		fontSize: 14,
		marginTop: 2,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.45)',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 100,
	},
	confirmModal: {
		backgroundColor: '#222',
		borderRadius: 18,
		padding: 24,
		alignItems: 'center',
		maxWidth: 320,
		shadowColor: '#000',
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 8,
	},
	confirmTitle: {
		color: '#ffd600',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	confirmText: {
		color: '#fff',
		fontSize: 15,
		marginBottom: 18,
		textAlign: 'center',
	},
	confirmActions: {
		flexDirection: 'row',
		gap: 18,
	},
	confirmBtn: {
		paddingVertical: 8,
		paddingHorizontal: 18,
		borderRadius: 8,
		backgroundColor: '#333',
	},
	confirmBtnText: {
		color: '#ffd600',
		fontSize: 16,
		fontWeight: 'bold',
	},
	confirmBtnDanger: {
		backgroundColor: '#ffd600',
	},
	confirmBtnDangerText: {
		color: '#222',
	},
});
