import { ReactNode } from 'react';
import {
	Pressable,
	PressableProps,
	StyleSheet,
	Text,
} from 'react-native';

export function Button({
	children,
	style,
	...props
}: PressableProps & { children: ReactNode }) {
	return (
		<Pressable style={[styles.button, style]} {...props}>
			<Text style={styles.text}>{children}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#222',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 20,
		alignItems: 'center',
	},
	text: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
});
