// Overlay for narration text with fade in/out
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

export function NarrationOverlay({
	text,
}: {
	text: string;
}) {
	const opacity = useRef(new Animated.Value(0)).current;
	const prevText = useRef<string | null>(null);

	useEffect(() => {
		if (text) {
			// If text changes, fade in
			Animated.timing(opacity, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
			}).start();
		} else {
			// If text is cleared, fade out
			Animated.timing(opacity, {
				toValue: 0,
				duration: 400,
				useNativeDriver: true,
			}).start();
		}
		prevText.current = text;
	}, [text]);

	return (
		<View
			style={{
				position: 'absolute',
				top: 40,
				left: 0,
				right: 0,
				alignItems: 'center',
				pointerEvents: 'none',
			}}
		>
			<Animated.View
				style={{
					opacity,
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
			</Animated.View>
		</View>
	);
}
