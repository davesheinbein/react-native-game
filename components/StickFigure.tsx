import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';

/**
 * Animated stick figure with bounce, jump, waving limbs, and optional squash/stretch.
 *
 * @param position - World position of the figure [x, y, z].
 * @param scale - Uniform scale factor.
 * @param isJumping - Triggers jump animation.
 * @param onJumpEnd - Callback when jump ends.
 * @param onBounce - Callback when bounce cycle completes.
 * @param onLand - Callback when landing from jump.
 * @param headColor - Color for the head.
 * @param bodyColor - Color for the body.
 * @param accentColor - Color for limbs.
 * @param enableSquash - Enable squash/stretch effect.
 */
export function StickFigure({
	position = [0, 0, 0],
	scale = 1,
	isJumping = false,
	onJumpEnd,
	onBounce,
	onLand,
	headColor = '#fff',
	bodyColor = '#ffd600',
	accentColor = '#4caf50',
	enableSquash = false,
}: {
	position?: [number, number, number];
	scale?: number;
	isJumping?: boolean;
	onJumpEnd?: () => void;
	onBounce?: () => void;
	onLand?: () => void;
	headColor?: string;
	bodyColor?: string;
	accentColor?: string;
	enableSquash?: boolean;
}) {
	const bounceRef = useRef<THREE.Group>(null);
	const groupRef = useRef<THREE.Group>(null);
	const leftArmRef = useRef<THREE.Mesh>(null);
	const rightArmRef = useRef<THREE.Mesh>(null);
	const leftLegRef = useRef<THREE.Mesh>(null);
	const rightLegRef = useRef<THREE.Mesh>(null);
	const jumpStart = useRef<number | null>(null);
	const wasJumping = useRef(false);
	const lastBouncePhase = useRef(0);
	const jumpDuration = 0.5; // seconds
	const jumpHeight = 0.7;
	const idleBounceHeight = 0.08;
	const idleBounceSpeed = 2.2;

	useFrame((state) => {
		const t = state.clock.getElapsedTime();
		// Bouncing effect: vertical position only (no squash/stretch)
		let bounceY = 0.12 * Math.abs(Math.sin(t * 2.2));
		let squash = 1;
		let stretch = 1;

		// Track bounce phase for onBounce callback
		const bouncePhase = Math.floor(
			(t * idleBounceSpeed) / Math.PI
		);
		if (
			onBounce &&
			bouncePhase !== lastBouncePhase.current &&
			!isJumping
		) {
			onBounce();
			lastBouncePhase.current = bouncePhase;
		}

		// Jump overrides bounce
		let y = 0;
		if (isJumping && jumpStart.current === null) {
			jumpStart.current = t;
			wasJumping.current = true;
		}
		if (jumpStart.current !== null) {
			const jumpElapsed = t - jumpStart.current;
			if (jumpElapsed < jumpDuration) {
				y =
					jumpHeight *
					Math.sin(Math.PI * (jumpElapsed / jumpDuration));
				bounceY = 0; // Don't bounce while jumping
				if (enableSquash) {
					// Squash at takeoff/landing, stretch at peak
					const phase = Math.sin(
						Math.PI * (jumpElapsed / jumpDuration)
					);
					squash =
						1 -
						0.18 *
							Math.abs(
								Math.cos(
									Math.PI * (jumpElapsed / jumpDuration)
								)
							);
					stretch = 1 + 0.18 * phase;
				}
			} else {
				jumpStart.current = null;
				if (onJumpEnd) onJumpEnd();
				if (onLand && wasJumping.current) {
					onLand();
					wasJumping.current = false;
				}
			}
		} else {
			y = idleBounceHeight * Math.sin(idleBounceSpeed * t);
			if (enableSquash) {
				// Squash at bottom, stretch at top
				const phase = Math.sin(idleBounceSpeed * t);
				squash =
					1 -
					0.12 * Math.abs(Math.cos(idleBounceSpeed * t));
				stretch = 1 + 0.12 * phase;
			}
		}

		if (bounceRef.current) {
			bounceRef.current.position.y =
				position[1] + bounceY + y;
			if (enableSquash) {
				bounceRef.current.scale.set(
					1 * scale,
					squash * scale,
					1 * scale
				);
			} else {
				bounceRef.current.scale.set(
					1 * scale,
					1 * scale,
					1 * scale
				);
			}
		}
		if (groupRef.current) {
			groupRef.current.rotation.z =
				0.05 * Math.sin(t * 1.2);
		}
		// Arms wave
		if (leftArmRef.current)
			leftArmRef.current.rotation.z =
				Math.PI / 4 +
				0.15 * Math.sin(t * 2.2) +
				0.08 * Math.sin(t * 3.1);
		if (rightArmRef.current)
			rightArmRef.current.rotation.z =
				-Math.PI / 4 -
				0.15 * Math.sin(t * 2.2) -
				0.08 * Math.cos(t * 3.1);
		// Legs: kick forward/backward more when jumping, subtle walk otherwise
		if (leftLegRef.current)
			leftLegRef.current.rotation.z =
				isJumping ?
					Math.PI / 8 +
					0.55 *
						Math.sin(
							Math.PI *
								((jumpStart.current !== null ?
									state.clock.getElapsedTime() -
									jumpStart.current
								:	0) /
									jumpDuration)
						)
				:	Math.PI / 8 +
					0.18 * Math.sin(t * 2.2) +
					0.06 * Math.cos(t * 2.3);
		if (rightLegRef.current)
			rightLegRef.current.rotation.z =
				isJumping ?
					-Math.PI / 8 -
					0.55 *
						Math.sin(
							Math.PI *
								((jumpStart.current !== null ?
									state.clock.getElapsedTime() -
									jumpStart.current
								:	0) /
									jumpDuration)
						)
				:	-Math.PI / 8 -
					0.18 * Math.sin(t * 2.2) -
					0.06 * Math.sin(t * 2.3);
	});

	// Prop validation (basic)
	if (!Array.isArray(position) || position.length !== 3) {
		throw new Error(
			'StickFigure: position must be a [x, y, z] array'
		);
	}
	if (typeof scale !== 'number' || scale <= 0) {
		throw new Error(
			'StickFigure: scale must be a positive number'
		);
	}

	return (
		<group
			ref={bounceRef}
			position={position}
			scale={[scale, scale, scale]}
		>
			<group ref={groupRef}>
				{/* Hollow Head: Torus */}
				<mesh
					position={[0, 0.69, 0]}
					castShadow
					receiveShadow
				>
					<torusGeometry args={[0.22, 0.07, 16, 32]} />
					<meshStandardMaterial
						color={headColor}
						emissive={accentColor}
						emissiveIntensity={0.25}
					/>
				</mesh>
				{/* Face: Eyes (large, anime-style) */}
				<mesh
					position={[-0.07, 0.78, 0.05]}
					scale={[1, 1.7, 1]}
				>
					<sphereGeometry args={[0.045, 16, 16]} />
					<meshStandardMaterial color={'#2196f3'} />
				</mesh>
				<mesh
					position={[0.07, 0.78, 0.05]}
					scale={[1, 1.7, 1]}
				>
					<sphereGeometry args={[0.045, 16, 16]} />
					<meshStandardMaterial color={'#2196f3'} />
				</mesh>
				{/* Smile (macaroni noodle */}
				<mesh
					position={[0, 0.65, 0.05]}
					rotation={[Math.PI * 1.0, 0, 0]}
				>
					<torusGeometry
						args={[0.09, 0.018, 22, 80, Math.PI * 1]}
					/>
					<meshStandardMaterial color={'#e53935'} />
				</mesh>
				{/* Belly: round sphere, slightly larger than head */}
				<mesh
					position={[0, 0.15, 0]}
					castShadow
					receiveShadow
				>
					<sphereGeometry args={[0.18, 16, 16]} />
					<meshStandardMaterial color={bodyColor} />
				</mesh>
				{/* Body: thinner cylinder connecting head and belly (reduced neck width) */}
				<mesh position={[0, 0.35, 0]}>
					<cylinderGeometry args={[0.05, 0.045, 0.3, 16]} />
					<meshStandardMaterial color={bodyColor} />
				</mesh>
				{/* Arms (swing with bounce and wave) */}
				<mesh ref={leftArmRef} position={[-0.22, 0.32, 0]}>
					<cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
					<meshStandardMaterial color={accentColor} />
				</mesh>
				<mesh ref={rightArmRef} position={[0.22, 0.32, 0]}>
					<cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
					<meshStandardMaterial color={accentColor} />
				</mesh>
				{/* Legs (subtle walk and wave animation) */}
				<mesh ref={leftLegRef} position={[-0.12, -0.25, 0]}>
					<cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
					<meshStandardMaterial color={accentColor} />
				</mesh>
				<mesh ref={rightLegRef} position={[0.12, -0.25, 0]}>
					<cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
					<meshStandardMaterial color={accentColor} />
				</mesh>
				{/* Shadow under the figure: more realistic with radial gradient */}
				<mesh
					position={[0, -0.45, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
				>
					<circleGeometry args={[0.22, 32]} />
					<meshStandardMaterial
						color={'#222'}
						transparent
						opacity={0.18}
					/>
				</mesh>
			</group>
		</group>
	);
}
// Accessibility: This is a purely visual 3D component and does not expose ARIA roles. If you need accessibility, provide alternative UI or narration.
