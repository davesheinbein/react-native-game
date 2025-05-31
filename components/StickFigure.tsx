import React from 'react';

// 3D Stick Figure for web/native 3D (Three.js)
// Minimal 3D stick figure using react-three-fiber/three.js primitives
export function StickFigure({
	position = [0, 0, 0],
	scale = 1,
}: {
	position?: [number, number, number];
	scale?: number;
}) {
	return (
		<group
			position={position}
			scale={[scale, scale, scale]}
		>
			{/* Hollow Head: Torus */}
			<mesh position={[0, 0.6, 0]}>
				<torusGeometry args={[0.22, 0.07, 16, 32]} />
				<meshStandardMaterial color={'#fff'} />
			</mesh>
			{/* Belly: round sphere, slightly larger than head */}
			<mesh position={[0, 0.15, 0]}>
				<sphereGeometry args={[0.18, 16, 16]} />
				<meshStandardMaterial color={'#fff'} />
			</mesh>
			{/* Body: thinner cylinder connecting head and belly */}
			<mesh position={[0, 0.35, 0]}>
				<cylinderGeometry args={[0.07, 0.07, 0.3, 8]} />
				<meshStandardMaterial color={'#fff'} />
			</mesh>
			{/* Arms */}
			<mesh
				position={[-0.22, 0.32, 0]}
				rotation={[0, 0, Math.PI / 4]}
			>
				<cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
				<meshStandardMaterial color={'#fff'} />
			</mesh>
			<mesh
				position={[0.22, 0.32, 0]}
				rotation={[0, 0, -Math.PI / 4]}
			>
				<cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
				<meshStandardMaterial color={'#fff'} />
			</mesh>
			{/* Legs */}
			<mesh
				position={[-0.12, -0.25, 0]}
				rotation={[0, 0, Math.PI / 8]}
			>
				<cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
				<meshStandardMaterial color={'#fff'} />
			</mesh>
			<mesh
				position={[0.12, -0.25, 0]}
				rotation={[0, 0, -Math.PI / 8]}
			>
				<cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
				<meshStandardMaterial color={'#fff'} />
			</mesh>
		</group>
	);
}
