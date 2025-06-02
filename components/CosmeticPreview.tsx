import React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function CosmeticPreview({
	cosmetic,
}: {
	cosmetic: any;
}) {
	return (
		<View style={styles.container}>
			{cosmetic.image ?
				<Image
					source={{ uri: cosmetic.image }}
					style={styles.image}
				/>
			:	<View style={styles.placeholder}>
					<Text style={styles.text}>{cosmetic.name}</Text>
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 8,
	},
	image: {
		width: 48,
		height: 48,
		borderRadius: 12,
		marginBottom: 4,
	},
	placeholder: {
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: '#eee',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 12,
		color: '#888',
		textAlign: 'center',
	},
});
