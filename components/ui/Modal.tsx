import { ReactNode } from 'react';
import {
	ModalProps,
	Modal as RNModal,
	StyleSheet,
	View,
} from 'react-native';

export function Modal({
	children,
	...props
}: ModalProps & { children: ReactNode }) {
	return (
		<RNModal transparent animationType='fade' {...props}>
			<View style={styles.overlay}>
				<View style={styles.content}>{children}</View>
			</View>
		</RNModal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 24,
		minWidth: 250,
		maxWidth: '80%',
		alignItems: 'center',
	},
});
