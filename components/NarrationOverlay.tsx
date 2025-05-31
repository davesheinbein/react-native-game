// Overlay for narration text with fade in/out
import React from 'react';
import { Text, View } from 'react-native';

export function NarrationOverlay({
	text,
}: {
	text: string;
}) {
	// TODO: Add fade animation
	return (
		<View
			style={{
				position: 'absolute',
				top: 40,
				left: 0,
				right: 0,
				alignItems: 'center',
			}}
		>
			<Text
				style={{
					color: '#fff',
					fontSize: 18,
					backgroundColor: '#222a',
					padding: 12,
					borderRadius: 8,
				}}
			>
				{text}
			</Text>
		</View>
	);
}
