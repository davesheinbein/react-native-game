import React from 'react';
import { colors } from '../constants/colors';

export function PlatformShape({
	sides,
}: {
	sides: number;
}) {
	// Fix: ensure all platforms are centered and have consistent scale/height
	// Move platform down so it renders beneath the stick figure
	const platformPosition = [0, -0.7, 0] as [
		number,
		number,
		number,
	];
	if (sides === 3) {
		// Pyramid (Tetrahedron)
		return (
			<mesh
				position={platformPosition}
				rotation={[Math.PI, 0, 0]}
			>
				<tetrahedronGeometry args={[1.2]} />
				<meshStandardMaterial color={colors.background} />
			</mesh>
		);
	}
	if (sides === 4) {
		// Cube
		return (
			<mesh position={platformPosition}>
				<boxGeometry args={[2, 2, 2]} />
				<meshStandardMaterial color={colors.background} />
			</mesh>
		);
	}
	if (sides === 6) {
		// Hexagonal prism
		return (
			<mesh position={platformPosition}>
				<cylinderGeometry args={[1, 1, 0.8, 6]} />
				<meshStandardMaterial color={colors.background} />
			</mesh>
		);
	}
	if (sides === 8) {
		// Octagonal prism
		return (
			<mesh position={platformPosition}>
				<cylinderGeometry args={[1, 1, 0.8, 8]} />
				<meshStandardMaterial color={colors.background} />
			</mesh>
		);
	}
	return null;
}
