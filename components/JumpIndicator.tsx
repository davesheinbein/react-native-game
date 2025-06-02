// Shows possible jump directions (arrows, highlights, etc)
import { a, useSpring } from '@react-spring/three';
import React, { useMemo } from 'react';
import { useCheatSafeSides } from '../game/cheatcode';

export function JumpIndicator3D({
	sides,
	safeSides,
	hoveredSide,
	platformRotation = 0,
	platformSize = 1,
	platformHeight = 0.8,
}: {
	sides: number;
	safeSides: number[];
	hoveredSide?: number | null;
	platformRotation?: number;
	platformSize?: number;
	platformHeight?: number;
}) {
	const [showSafeSides] = useCheatSafeSides();
	// Geometry and layout constants
	const indicatorRadius = 0.08 * platformSize;
	const baseRadius = platformSize;
	const angleStep = (2 * Math.PI) / sides;
	const topY = platformHeight / 2 + 0.01;
	const indicatorOutwardOffset = baseRadius * 1.08; // just outside the edge
	const indicatorAbove = 0.08; // slightly above platform

	// Memoize geometry for performance
	const sphereGeometry = useMemo(
		() => [indicatorRadius, 24, 16] as const,
		[indicatorRadius]
	);

	// Animate scale for the hovered indicator only (avoid useSpring in a loop)
	const spring = useSpring({
		scale: hoveredSide != null ? 1.25 : 1,
		config: { tension: 300, friction: 18 },
	});

	return (
		<group rotation={[0, platformRotation, 0]}>
			{Array.from({ length: sides }).map((_, i) => {
				// Calculate the angle and position for each indicator
				const angle = -Math.PI / 2 + i * angleStep;
				const x = Math.cos(angle) * indicatorOutwardOffset;
				const z = Math.sin(angle) * indicatorOutwardOffset;
				const y = topY + indicatorAbove;

				// Determine color and scale for visual feedback
				const isHovered = hoveredSide === i;
				const isSafe =
					showSafeSides && safeSides.includes(i);
				const color =
					isHovered ? '#ffd600'
					: isSafe ? '#4caf50'
					: '#e57373';
				const emissive = color;
				const scaleValue = isHovered ? spring.scale : 1;
				const showFocus = isHovered;

				return (
					<a.group
						key={i}
						position={[x, y, z]}
						scale={scaleValue}
					>
						<mesh castShadow receiveShadow>
							<sphereGeometry args={sphereGeometry} />
							<meshStandardMaterial
								color={color}
								emissive={emissive}
								emissiveIntensity={isHovered ? 0.5 : 0.35}
								metalness={0.3}
								roughness={0.4}
							/>
							{/* Focus ring: subtle animated outline for accessibility/UX */}
							{showFocus && (
								<a.mesh scale={spring.scale}>
									<sphereGeometry
										args={[indicatorRadius * 1.18, 24, 16]}
									/>
									<meshStandardMaterial
										color='#fffde7'
										opacity={0.45}
										transparent
									/>
								</a.mesh>
							)}
							{/* Subtle drop shadow for better separation */}
							<mesh
								position={[0, -indicatorRadius * 1.1, 0]}
							>
								<sphereGeometry
									args={[indicatorRadius * 0.7, 16, 8]}
								/>
								<meshStandardMaterial
									color='#000'
									opacity={0.18}
									transparent
								/>
							</mesh>
						</mesh>
					</a.group>
				);
			})}
		</group>
	);
}
