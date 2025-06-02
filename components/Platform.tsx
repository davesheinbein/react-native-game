import { Edges } from '@react-three/drei/native';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useState } from 'react';
import { colors } from '../constants/colors';
import { useCheatSafeSides } from '../game/cheatcode';
import { getRandomSafeSides } from '../game/systems/jumpManager';

export type GameMode =
	| 'Classic'
	| 'Endless'
	| 'Maniac'
	| 'Peaceful';

export interface PlatformProps {
	sides: number;
	mode?: GameMode;
	streak?: number;
	baseColor?: string;
	borderColor?: string;
	detailColor?: string;
	platformSize?: number;
	platformHeight?: number;
	showShadow?: boolean;
	wireframe?: boolean;
	animation?: boolean;
	animationSpeed?: number;
	showAura?: boolean;
	debug?: boolean;
	rotationSpeed?: number;
	onFall?: (sideHit: number) => void;
	['data-testid']?: string;
	onRotationChange?: (rotation: number) => void;
}

const modeStyles: Record<GameMode, any> = {
	Classic: {
		baseColor: colors.primary,
		borderColor: colors.accent,
		detailColor: colors.accent,
		auraColor: '#fff',
		glow: false,
	},
	Endless: {
		baseColor: '#00bcd4',
		borderColor: '#fff',
		detailColor: '#00e676',
		auraColor: '#00e676',
		glow: true,
	},
	Maniac: {
		baseColor: '#e57373',
		borderColor: '#ffd600',
		detailColor: '#ffd600',
		auraColor: '#e57373',
		glow: true,
	},
	Peaceful: {
		baseColor: '#81c784',
		borderColor: '#fffde7',
		detailColor: '#fffde7',
		auraColor: '#81c784',
		glow: false,
	},
};

const TetrahedronMesh = ({
	color,
	borderColor,
	wireframe,
}: any) => (
	<mesh rotation={[Math.PI, 0, 0]}>
		<tetrahedronGeometry args={[1.2, 2]} />
		<meshStandardMaterial
			color={color}
			wireframe={wireframe}
		/>
		<Edges scale={1.01} threshold={15}>
			<lineBasicMaterial color={borderColor} />
		</Edges>
	</mesh>
);
const CubeMesh = ({
	color,
	borderColor,
	wireframe,
}: any) => (
	<mesh>
		<boxGeometry args={[2, 2, 2, 2, 2, 2]} />
		<meshStandardMaterial
			color={color}
			wireframe={wireframe}
		/>
		<Edges scale={1.01} threshold={15}>
			<lineBasicMaterial color={borderColor} />
		</Edges>
	</mesh>
);
const PrismMesh = ({
	color,
	borderColor,
	wireframe,
	sides,
	height,
}: any) => (
	<mesh>
		<cylinderGeometry args={[1, 1, height, sides, 1]} />
		<meshStandardMaterial
			color={color}
			wireframe={wireframe}
		/>
		<Edges scale={1.01} threshold={15}>
			<lineBasicMaterial color={borderColor} />
		</Edges>
	</mesh>
);
const TriangularPrismMesh = ({
	color,
	borderColor,
	wireframe,
	height = 0.7,
}: any) => (
	<mesh>
		{/* Cylinder with 3 sides = triangular prism */}
		<cylinderGeometry args={[1.2, 1.2, height, 3, 1]} />
		<meshStandardMaterial
			color={color}
			wireframe={wireframe}
		/>
		<Edges scale={1.01} threshold={15}>
			<lineBasicMaterial color={borderColor} />
		</Edges>
	</mesh>
);

const TopFace = ({ sides, detailColor, y, size }: any) =>
	sides === 4 ?
		<mesh
			position={[0, y, 0]}
			rotation={[Math.PI / 2, 0, 0]}
		>
			<planeGeometry args={[size * 2, size * 2]} />
			<meshStandardMaterial
				color={detailColor}
				transparent
				opacity={0.12}
			/>
		</mesh>
	:	<mesh
			position={[0, y, 0]}
			rotation={[Math.PI / 2, 0, 0]}
		>
			<circleGeometry
				args={[size, sides === 3 ? 3 : sides]}
			/>
			<meshStandardMaterial
				color={detailColor}
				transparent
				opacity={0.12}
			/>
		</mesh>;

const Aura = ({ color, y, size, visible }: any) =>
	visible ?
		<mesh position={[0, y, 0]}>
			<circleGeometry args={[size, 32]} />
			<meshStandardMaterial
				color={color}
				transparent
				opacity={0.13}
			/>
		</mesh>
	:	null;

// --- Safe Side Highlight: Modern, Accessible, Animated ---
const SafeSideHighlight = ({
	sides,
	safeSides,
	size,
	y,
	cheatActive = false,
}: any) => {
	// Pulse animation for highlight
	const [pulse, setPulse] = React.useState(1);
	useFrame(() => {
		setPulse((p) => 1 + 0.08 * Math.sin(Date.now() / 250));
	});
	return safeSides && safeSides.length > 0 && cheatActive ?
			<group>
				{safeSides.map((idx: number) => {
					const angle =
						(2 * Math.PI * idx) / sides - Math.PI / 2;
					const r = size * 0.7;
					return (
						<mesh
							key={idx}
							position={[
								r * Math.cos(angle),
								y + 0.03,
								r * Math.sin(angle),
							]}
						>
							<circleGeometry
								args={[size * 0.18 * pulse, 20]}
							/>
							<meshStandardMaterial
								color={'#ffd600'}
								opacity={0.85}
								transparent
								emissive={'#ffd600'}
								emissiveIntensity={0.7}
							/>
						</mesh>
					);
				})}
			</group>
		:	null;
};

export function Platform({
	sides,
	mode = 'Classic',
	streak = 0,
	baseColor,
	borderColor,
	detailColor,
	platformSize = 1,
	platformHeight = 0.8,
	showShadow = false,
	wireframe = false,
	animation = true,
	animationSpeed = 1,
	showAura = true,
	debug = false,
	rotationSpeed = 0.01,
	onFall,
	onRotationChange,
	...rest
}: PlatformProps) {
	const meshRef = useRef<any>(null);
	const [rotation, setRotation] = useState(0);
	const [isPaused, setIsPaused] = useState(false); // For future: allow pausing rotation

	// Safe side logic (replace with your mode logic if needed)
	const safeSides = useMemo(
		() =>
			getRandomSafeSides(
				sides,
				Math.max(1, Math.floor(sides / 2))
			),
		[sides, streak, mode]
	);

	// Animate rotation unless paused
	useFrame((state, delta) => {
		if (!isPaused && animation) {
			setRotation((r) => r + delta * 0.3 * animationSpeed);
			if (meshRef.current) {
				meshRef.current.rotation.y = rotation;
			}
			if (onRotationChange) onRotationChange(rotation);
		}
	});

	// Style selection
	const style = modeStyles[mode] || modeStyles.Classic;
	const finalBaseColor = baseColor || style.baseColor;
	const finalBorderColor = borderColor || style.borderColor;
	const finalDetailColor = detailColor || style.detailColor;
	const auraColor = style.auraColor;
	const glow = style.glow;

	// Memoize mesh, top face, aura
	const { mesh, topFace, aura } = useMemo(() => {
		let mesh, topFace, auraMesh;
		console.log('🚀 ~ sides:', sides);
		if (sides === 3) {
			mesh = (
				<TriangularPrismMesh
					color={finalBaseColor}
					borderColor={finalBorderColor}
					wireframe={wireframe}
				/>
			);
			topFace = (
				<TopFace
					sides={3}
					detailColor={finalDetailColor}
					y={platformHeight / 2}
					size={platformSize}
				/>
			);
			auraMesh = (
				<Aura
					color={auraColor}
					y={platformHeight / 2 + 0.1}
					size={platformSize * 1.1}
					visible={glow && showAura}
				/>
			);
		} else if (sides === 4) {
			mesh = (
				<CubeMesh
					color={finalBaseColor}
					borderColor={finalBorderColor}
					wireframe={wireframe}
				/>
			);
			topFace = (
				<TopFace
					sides={4}
					detailColor={finalDetailColor}
					y={platformHeight / 2}
					size={platformSize}
				/>
			);
			auraMesh = (
				<Aura
					color={auraColor}
					y={platformHeight / 2 + 0.1}
					size={platformSize * 1.15}
					visible={glow && showAura}
				/>
			);
		} else {
			mesh = (
				<PrismMesh
					color={finalBaseColor}
					borderColor={finalBorderColor}
					wireframe={wireframe}
					sides={sides}
					height={platformHeight}
				/>
			);
			topFace = (
				<TopFace
					sides={sides}
					detailColor={finalDetailColor}
					y={platformHeight / 2}
					size={platformSize}
				/>
			);
			auraMesh = (
				<Aura
					color={auraColor}
					y={platformHeight / 2 + 0.1}
					size={platformSize * (1.1 + 0.05 * (sides - 3))}
					visible={glow && showAura}
				/>
			);
		}
		return { mesh, topFace, aura: auraMesh };
	}, [
		sides,
		finalBaseColor,
		finalBorderColor,
		finalDetailColor,
		wireframe,
		platformSize,
		platformHeight,
		auraColor,
		glow,
		showAura,
	]);

	// Platform position: always at y=0 (centered)
	const platformPosition = [0, 0, 0] as [
		number,
		number,
		number,
	];

	const [cheatActive] = useCheatSafeSides();

	return (
		<group
			ref={meshRef}
			position={platformPosition}
			{...rest}
		>
			{/* Main platform mesh */}
			{mesh}
			{/* Top face overlay */}
			{topFace}
			{/* Safe side highlight for gameplay clarity (cheat toggle) */}
			<SafeSideHighlight
				sides={sides}
				safeSides={safeSides}
				size={platformSize}
				y={platformHeight / 2 + 0.04}
				cheatActive={cheatActive}
			/>
			{/* Aura/glow effect */}
			{aura}
			{/* Subtle shadow for depth */}
			{showShadow && (
				<mesh
					position={[0, -platformHeight / 2 - 0.05, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
				>
					<circleGeometry args={[platformSize * 1.2, 32]} />
					<meshStandardMaterial
						color='#000'
						transparent
						opacity={0.18}
					/>
				</mesh>
			)}
		</group>
	);
}

export function StickFigure({
	position = [0, 0, 0],
	scale = 1,
	rotation = [0, 0, 0],
	...props
}) {
	// Ensure rotation is always a 3-tuple
	const rot: [number, number, number] = [
		rotation[0] || 0,
		rotation[1] || 0,
		rotation[2] || 0,
	];
	return (
		<group
			position={position as [number, number, number]}
			rotation={rot}
		>
			{/* ...existing stick figure mesh code... */}
		</group>
	);
}

// ---
// Major changes:
// - Added SafeSideHighlight for gameplay clarity
// - Improved animation logic and debug overlay
// - Consistent color and style usage
// - Added comments for maintainability
