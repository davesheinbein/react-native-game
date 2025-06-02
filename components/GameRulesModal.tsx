import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function GameRulesModal({
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
					<TouchableOpacity
						style={styles.closeBtn}
						onPress={onClose}
						accessibilityLabel='Close rules modal'
						accessibilityRole='button'
					>
						<MaterialCommunityIcons
							name='close'
							size={20}
							color='#fff'
						/>
					</TouchableOpacity>
					<Text style={styles.header}>How to Play</Text>
					<ScrollView style={{ maxHeight: 340 }}>
						<Text style={styles.text}>
							<b>Don't Miss</b> is a modern, accessible
							platform-jumping game. Your goal is to jump
							from platform to platform, always landing on a{' '}
							<b>safe side</b>.
						</Text>
						<Text style={styles.text}>
							- Each platform is a 3D shape (Tetrahedron,
							Cube, Prism, Disc) with multiple sides.
							{'\n'}- Only some sides are safe! The rest
							will make you fall.
							{'\n'}- Tap or use keyboard to jump to a side.
							If you land on a safe side, you continue. If
							not, it's game over.
							{'\n'}- The number of safe sides and platform
							shape changes as your streak increases.
							{'\n'}- Power-ups, penalties, and narration
							may appear as you progress.
							{'\n'}- Try to beat your high score and climb
							the leaderboards!
						</Text>
						<Text style={styles.text}>
							<b>Tips:</b>
							{'\n'}- Use the cheatcodes menu (Ctrl+S) for
							accessibility options.
							{'\n'}- Unlock cosmetics and achievements as
							you play.
							{'\n'}- Each game mode (Classic, Endless,
							Maniac, Peaceful) has unique rules and
							difficulty scaling.
						</Text>
					</ScrollView>
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
		backgroundColor: '#23272f',
		borderRadius: 16,
		padding: 28,
		width: 340,
		alignItems: 'center',
		position: 'relative',
		shadowColor: '#000',
		shadowOpacity: 0.25,
		shadowRadius: 12,
		elevation: 10,
	},
	header: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#ffd600',
		marginBottom: 18,
		letterSpacing: 1,
	},
	text: {
		fontSize: 15,
		color: '#fff',
		marginBottom: 14,
		lineHeight: 22,
	},
	closeBtn: {
		position: 'absolute',
		top: 12,
		right: 12,
		zIndex: 2,
		width: 28,
		height: 28,
		borderRadius: 8,
		backgroundColor: '#e57373',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 0,
	},
});
