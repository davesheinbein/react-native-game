import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
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
}: SettingsPanelProps) {
	const [cheatModalOpen, setCheatModalOpen] = React.useState(false);
	const [rulesModalOpen, setRulesModalOpen] = React.useState(false);

	return (
		<View style={styles.panelRoot}>
			{!isOpen ? (
				<TouchableOpacity
					onPress={onOpen}
					accessibilityRole='button'
					accessibilityLabel='Open settings'
					style={styles.iconBtn}
				>
					<MaterialCommunityIcons name='cog-outline' size={32} color='#ffd600' />
				</TouchableOpacity>
			) : (
				<View style={styles.panelOpen}>
					{/* Close button */}
					<TouchableOpacity
						onPress={onClose}
						accessibilityRole='button'
						accessibilityLabel='Close settings'
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons name='close-circle-outline' size={32} color='#ffd600' />
					</TouchableOpacity>
					{/* Rules icon button */}
					<TouchableOpacity
						onPress={() => setRulesModalOpen(true)}
						accessibilityRole='button'
						accessibilityLabel='Show game rules and how to play'
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons name='book-open-variant' size={26} color='#ffd600' />
						<Text style={styles.cheatLabel}>Rules</Text>
					</TouchableOpacity>
					{/* Music play/pause */}
					<TouchableOpacity
						onPress={onToggleMusic}
						accessibilityRole='button'
						accessibilityLabel={isMusicPlaying ? 'Pause music' : 'Play music'}
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons name={isMusicPlaying ? 'pause-circle-outline' : 'play-circle-outline'} size={28} color='#b2dfdb' />
					</TouchableOpacity>
					{/* Next track */}
					<TouchableOpacity
						onPress={onNextTrack}
						accessibilityRole='button'
						accessibilityLabel='Change music track'
						style={styles.iconBtn}
					>
						<Text style={styles.musicTitle}>{musicTitle} (tap to change)</Text>
					</TouchableOpacity>
					{/* Mute toggle */}
					<TouchableOpacity
						onPress={onToggleMute}
						accessibilityRole='button'
						accessibilityLabel={isMuted ? 'Unmute all' : 'Mute all'}
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons name={isMuted ? 'volume-off' : 'volume-high'} size={28} color='#ffd600' />
					</TouchableOpacity>
					{/* SFX toggle */}
					<TouchableOpacity
						onPress={onToggleSfx}
						accessibilityRole='button'
						accessibilityLabel={sfxEnabled ? 'Disable SFX' : 'Enable SFX'}
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons name={sfxEnabled ? 'bell-ring-outline' : 'bell-off-outline'} size={26} color='#ffd600' />
					</TouchableOpacity>
					{/* Reset high score */}
					<TouchableOpacity
						onPress={onResetHighScore}
						accessibilityRole='button'
						accessibilityLabel='Reset High Score'
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons name='restore' size={26} color='#ffd600' />
					</TouchableOpacity>
					{/* Cheatcodes button with tooltip */}
					<TouchableOpacity
						onPress={() => setCheatModalOpen(true)}
						accessibilityRole='button'
						accessibilityLabel='Open cheatcodes menu'
						style={styles.iconBtn}
					>
						<MaterialCommunityIcons name='code-braces' size={26} color='#ffd600' />
						<Text style={styles.cheatLabel}>Cheatcodes</Text>
					</TouchableOpacity>
				</View>
			)}
			<CheatcodesModal visible={cheatModalOpen} onClose={() => setCheatModalOpen(false)} />
			<GameRulesModal visible={rulesModalOpen} onClose={() => setRulesModalOpen(false)} />
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
});
