import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import { Platform, Text, View } from 'react-native';

function Platform3D({ sides }: { sides: number }) {
	// Fix: ensure all platforms are centered and have consistent scale/height
	if (sides === 3) {
		// Pyramid (Tetrahedron)
		return (
			<mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
				<tetrahedronGeometry args={[1.2]} />
				<meshStandardMaterial color='#222' />
			</mesh>
		);
	}
	if (sides === 4) {
		// Cube
		return (
			<mesh position={[0, 0, 0]}>
				<boxGeometry args={[2, 2, 2]} />
				<meshStandardMaterial color='#222' />
			</mesh>
		);
	}
	if (sides === 6) {
		// Hexagonal prism
		return (
			<mesh position={[0, 0, 0]}>
				<cylinderGeometry args={[1, 1, 0.8, 6]} />
				<meshStandardMaterial color='#222' />
			</mesh>
		);
	}
	if (sides === 8) {
		// Octagonal prism
		return (
			<mesh position={[0, 0, 0]}>
				<cylinderGeometry args={[1, 1, 0.8, 8]} />
				<meshStandardMaterial color='#222' />
			</mesh>
		);
	}
	return null;
}

function StickFigure3D() {
	// Simple stick figure: head (sphere), body (cylinder), arms/legs (cylinders)
	return (
		<group position={[0, 1.5, 0]}>
			{/* Head */}
			<mesh position={[0, 0.5, 0]}>
				<sphereGeometry args={[0.2, 16, 16]} />
				<meshStandardMaterial color='#fff' />
			</mesh>
			{/* Body */}
			<mesh position={[0, 0.1, 0]}>
				<cylinderGeometry args={[0.07, 0.07, 0.6, 8]} />
				<meshStandardMaterial color='#fff' />
			</mesh>
			{/* Arms */}
			<mesh
				position={[-0.22, 0.2, 0]}
				rotation={[0, 0, Math.PI / 4]}
			>
				<cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
				<meshStandardMaterial color='#fff' />
			</mesh>
			<mesh
				position={[0.22, 0.2, 0]}
				rotation={[0, 0, -Math.PI / 4]}
			>
				<cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
				<meshStandardMaterial color='#fff' />
			</mesh>
			{/* Legs */}
			<mesh
				position={[-0.12, -0.35, 0]}
				rotation={[0, 0, Math.PI / 8]}
			>
				<cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
				<meshStandardMaterial color='#fff' />
			</mesh>
			<mesh
				position={[0.12, -0.35, 0]}
				rotation={[0, 0, -Math.PI / 8]}
			>
				<cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
				<meshStandardMaterial color='#fff' />
			</mesh>
		</group>
	);
}

export function PlatformShape({
	sides,
}: {
	sides: number;
}) {
	// Canvas style: use fixed pixel values, not percentages
	const canvasStyle = {
		width: 180,
		height: 180,
		backgroundColor: 'transparent',
		borderRadius: 16,
		overflow: 'hidden',
	};

	// Error boundary for native (GLView/threejs issues)
	const [error, setError] = React.useState<string | null>(
		null
	);

	if (error) {
		return (
			<View
				style={{
					width: 180,
					height: 180,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#222',
					borderRadius: 16,
				}}
			>
				<Text
					style={{
						color: '#fff',
						textAlign: 'center',
						fontSize: 14,
					}}
				>
					3D rendering not supported on this device.{'\n'}
					Try on web or update Expo/three.js.
				</Text>
			</View>
		);
	}

	return (
		<View
			style={{
				width: 180,
				height: 180,
				margin: 12,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Canvas
				style={canvasStyle}
				camera={{
					position: [0, 3.5, 5],
					fov: 50,
					near: 0.1,
					far: 100,
				}}
				shadows={false}
				frameloop='demand'
				onError={
					Platform.OS !== 'web'
						? (e: any) => setError(e?.message || '3D error')
						: undefined
				}
			>
				<ambientLight intensity={0.8} />
				<directionalLight
					position={[5, 10, 7]}
					intensity={0.8}
					castShadow={false}
				/>
				<Platform3D sides={sides} />
				<StickFigure3D />
				{/* OrbitControls only on web */}
				{Platform.OS === 'web' ? (
					<OrbitControls
						enablePan={false}
						enableZoom={false}
					/>
				) : null}
			</Canvas>
		</View>
	);
}
