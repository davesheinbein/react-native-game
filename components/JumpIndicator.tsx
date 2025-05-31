// Shows possible jump directions (arrows, highlights, etc)
import React from 'react';
import { View } from 'react-native';

export function JumpIndicator({
	sides,
	safeSides,
}: {
	sides: number;
	safeSides: number[];
}) {
	// Render a small arrow or dot for each side, green if safe, gray if not
	const angleStep = (2 * Math.PI) / sides;
	const radius = 60;
	return (
		<View
			style={{
				width: 140,
				height: 140,
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				alignItems: 'center',
				justifyContent: 'center',
				pointerEvents: 'box-none', // allow touches to pass through
			}}
		>
			{Array.from({ length: sides }).map((_, i) => {
				const angle = -Math.PI / 2 + i * angleStep;
				const x = Math.cos(angle) * radius + 70 - 8;
				const y = Math.sin(angle) * radius + 70 - 8;
				const isSafe = safeSides.includes(i);
				return (
					<View
						key={i}
						style={{
							position: 'absolute',
							top: y,
							left: x,
							width: 16,
							height: 16,
							borderRadius: 8,
							backgroundColor: isSafe ? '#4caf50' : '#888',
							borderWidth: 2,
							borderColor: '#222',
							opacity: 0.85,
							shadowColor: isSafe ? '#4caf50' : '#000',
							shadowOpacity: isSafe ? 0.5 : 0.2,
							shadowRadius: 4,
						}}
					/>
				);
			})}
		</View>
	);
}
