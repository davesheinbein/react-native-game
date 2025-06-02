import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
	Modal,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useCheatSafeSides } from '../game/cheatcode';

// CheatcodesModal: Unified modal style, accessible, modern
export function CheatcodesModal({
	visible,
	onClose,
}: {
	visible: boolean;
	onClose: () => void;
}) {
	const [showSafeSides, setShowSafeSides] =
		useCheatSafeSides();
	return (
		<Modal
			visible={visible}
			transparent
			animationType='fade'
		>
			<TouchableOpacity
				activeOpacity={1}
				style={styles.overlay}
				onPress={onClose}
				accessible={false}
			>
				<TouchableOpacity
					activeOpacity={1}
					style={styles.modal}
					onPress={() => {}}
					accessible={false}
				>
					{/* Close button */}
					<TouchableOpacity
						style={styles.closeBtn}
						onPress={onClose}
						accessibilityLabel='Close cheatcodes menu'
						accessibilityRole='button'
						accessibilityHint='Closes the cheatcodes modal'
						activeOpacity={0.7}
					>
						<MaterialCommunityIcons
							name='close'
							size={18}
							color='#fff'
							style={{ fontWeight: 'bold' }}
						/>
					</TouchableOpacity>
					<Text style={styles.header}>Cheatcodes</Text>
					{/* Safe sides toggle */}
					<View style={styles.row}>
						<Text style={styles.label}>
							Show Safe Sides
						</Text>
						<Switch
							value={showSafeSides}
							onValueChange={setShowSafeSides}
							accessibilityLabel='Toggle safe side visibility'
						/>
					</View>
					<Text style={styles.tip}>
						Tip: Use Ctrl+S to toggle this menu during
						gameplay.
					</Text>
				</TouchableOpacity>
			</TouchableOpacity>
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
		width: 320,
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
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginVertical: 12,
	},
	label: {
		fontSize: 16,
		color: '#fff',
	},
	closeBtn: {
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
	tip: {
		fontSize: 12,
		color: '#bbb',
		marginTop: 18,
		textAlign: 'center',
	},
});
