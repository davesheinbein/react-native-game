// Renders the current platform shape (triangle, square, etc)
import React from 'react';
import { View } from 'react-native';

export function PlatformShape({
	shape,
	sides,
}: {
	shape: string;
	sides: number;
}) {
	// TODO: Render SVG or Canvas shape based on props
	return (
		<View
			style={{
				width: 120,
				height: 120,
				backgroundColor: '#222',
				borderRadius: 16,
				margin: 12,
			}}
		/>
	);
}
