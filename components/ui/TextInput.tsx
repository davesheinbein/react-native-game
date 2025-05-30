import {
	TextInput as RNTextInput,
	StyleSheet,
	TextInputProps,
} from 'react-native';

export function TextInput(props: TextInputProps) {
	return <RNTextInput style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 6,
		padding: 10,
		fontSize: 16,
		color: '#222',
		backgroundColor: '#fff',
	},
});
