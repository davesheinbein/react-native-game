import React from 'react';
import { Text, View } from 'react-native';
import { gameStyles } from './gameStyles';

export default function NotFound() {
	return (
		<View style={gameStyles.notFoundContainer}>
			<Text style={gameStyles.notFoundTitle}>
				Game Not Found
			</Text>
			<Text style={gameStyles.notFoundMessage}>
				Oops! The game failed to load properly. Please try
				refreshing the page or check your connection.
			</Text>
		</View>
	);
}
