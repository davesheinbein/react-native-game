import { Edges } from '@react-three/drei';
import React, {
	forwardRef,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Group } from 'three';
import { colors } from '../constants/colors';

export type GameMode =
	| 'Classic'
	| 'Endless'
	| 'Maniac'
	| 'Peaceful';

export interface PlatformShapeProps {
	sides: number;
	mode?: GameMode;
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
	children?: ReactNode;
	debug?: boolean;
	['data-testid']?: string;
}

// Mode-based style presets
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

// Shape mesh subcomponents
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

// Top face highlight
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

// Aura effect
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

/**
 * Modern, reusable 3D platform shape for all game modes.
 * Supports animation, aura, wireframe, shadow, and custom children.
 */
export const PlatformShape = forwardRef<
	Group,
	PlatformShapeProps
>(function PlatformShape(props, ref) {
	console.log('[PlatformShape] function called', props);
	try {
		const {
			sides,
			mode = 'Classic',
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
			children,
			debug = false,
			'data-testid': dataTestId,
		} = props;
		console.log('[PlatformShape] props destructured:', {
			sides,
			mode,
			baseColor,
			borderColor,
			detailColor,
			platformSize,
			platformHeight,
			showShadow,
			wireframe,
			animation,
			animationSpeed,
			showAura,
			children,
			debug,
			dataTestId,
		});
		const safeSides =
			typeof sides === 'number' && sides >= 3 ? sides : 3;
		console.log('[PlatformShape] safeSides:', safeSides);
		const style = modeStyles[mode] || modeStyles.Classic;
		console.log('[PlatformShape] style:', style);
		const finalBaseColor = baseColor || style.baseColor;
		const finalBorderColor =
			borderColor || style.borderColor;
		const finalDetailColor =
			detailColor || style.detailColor;
		const auraColor = style.auraColor;
		const glow = style.glow;
		console.log('[PlatformShape] final colors:', {
			finalBaseColor,
			finalBorderColor,
			finalDetailColor,
			auraColor,
			glow,
		});
		const groupRef = useRef<Group>(null);
		const combinedRef = useCallback(
			(node: Group) => {
				if (typeof ref === 'function') ref(node);
				else if (ref)
					(
						ref as React.MutableRefObject<Group | null>
					).current = node;
				groupRef.current = node;
			},
			[ref]
		);

		// Animation: pulse for Maniac, rotate for Endless, can be toggled
		useEffect(() => {
			console.log(
				'[PlatformShape] useEffect - animation:',
				{ animation, mode, animationSpeed }
			);
			if (!animation || !groupRef.current) return;
			let frame: number;
			const animate = () => {
				if (!groupRef.current) return;
				if (mode === 'Maniac') {
					const t =
						performance.now() * 0.002 * animationSpeed;
					const scale = 1 + 0.08 * Math.sin(t * 2);
					groupRef.current.scale.set(scale, scale, scale);
					groupRef.current.rotation.y = 0;
				} else if (mode === 'Endless') {
					const t =
						performance.now() * 0.001 * animationSpeed;
					groupRef.current.rotation.y = t % (2 * Math.PI);
					groupRef.current.scale.set(1, 1, 1);
				} else {
					groupRef.current.scale.set(1, 1, 1);
					groupRef.current.rotation.y = 0;
				}
				frame = requestAnimationFrame(animate);
			};
			animate();
			return () => {
				if (frame) cancelAnimationFrame(frame);
				if (groupRef.current) {
					groupRef.current.scale.set(1, 1, 1);
				}
			};
		}, [mode, animation, animationSpeed]);

		// Memoize mesh and top face for performance
		const { mesh, topFace, aura } = useMemo(() => {
			let mesh = null;
			let topFace = null;
			let auraMesh = null;
			console.log(
				'[PlatformShape] useMemo - mesh selection',
				{ safeSides }
			);
			if (safeSides === 3) {
				mesh = (
					<TetrahedronMesh
						color={finalBaseColor}
						borderColor={finalBorderColor}
						wireframe={wireframe}
					/>
				);
				topFace = (
					<TopFace
						sides={3}
						detailColor={finalDetailColor}
						y={platformSize * 1.1}
						size={platformSize * 0.7}
					/>
				);
				auraMesh = (
					<Aura
						color={auraColor}
						y={platformSize * 1.2}
						size={platformSize * 0.9}
						visible={glow && showAura}
					/>
				);
			} else if (safeSides === 4) {
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
						y={platformSize}
						size={platformSize}
					/>
				);
				auraMesh = (
					<Aura
						color={auraColor}
						y={platformSize * 1.1}
						size={platformSize * 1.3}
						visible={glow && showAura}
					/>
				);
			} else if (safeSides === 6) {
				mesh = (
					<PrismMesh
						color={finalBaseColor}
						borderColor={finalBorderColor}
						wireframe={wireframe}
						sides={6}
						height={platformHeight}
					/>
				);
				topFace = (
					<TopFace
						sides={6}
						detailColor={finalDetailColor}
						y={platformHeight / 2}
						size={platformSize}
					/>
				);
				auraMesh = (
					<Aura
						color={auraColor}
						y={platformHeight / 2 + 0.1}
						size={platformSize * 1.2}
						visible={glow && showAura}
					/>
				);
			} else if (safeSides === 8) {
				mesh = (
					<PrismMesh
						color={finalBaseColor}
						borderColor={finalBorderColor}
						wireframe={wireframe}
						sides={8}
						height={platformHeight}
					/>
				);
				topFace = (
					<TopFace
						sides={8}
						detailColor={finalDetailColor}
						y={platformHeight / 2}
						size={platformSize}
					/>
				);
				auraMesh = (
					<Aura
						color={auraColor}
						y={platformHeight / 2 + 0.1}
						size={platformSize * 1.3}
						visible={glow && showAura}
					/>
				);
			} else if (safeSides > 8) {
				mesh = (
					<PrismMesh
						color={finalBaseColor}
						borderColor={finalBorderColor}
						wireframe={wireframe}
						sides={safeSides}
						height={platformHeight}
					/>
				);
				topFace = (
					<TopFace
						sides={safeSides}
						detailColor={finalDetailColor}
						y={platformHeight / 2}
						size={platformSize}
					/>
				);
				auraMesh = (
					<Aura
						color={auraColor}
						y={platformHeight / 2 + 0.1}
						size={platformSize * 1.4}
						visible={glow && showAura}
					/>
				);
			}
			console.log('[PlatformShape] mesh, topFace, aura:', {
				mesh,
				topFace,
				aura: auraMesh,
			});
			return { mesh, topFace, aura: auraMesh };
		}, [
			safeSides,
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

		// Accessibility: keyboard focus/aria
		const [focused, setFocused] = useState(false);
		const handleFocus = useCallback(
			() => setFocused(true),
			[]
		);
		const handleBlur = useCallback(
			() => setFocused(false),
			[]
		);

		// Platform position: always at y=0 (centered), can be adjusted if needed
		const platformPosition = [0, 0, 0] as [
			number,
			number,
			number,
		];

		console.log(
			'[PlatformShape] about to render main group',
			{
				mesh,
				topFace,
				aura,
				platformPosition,
				showShadow,
				children,
				debug,
				dataTestId,
			}
		);
		return (
			<group
				ref={combinedRef}
				position={platformPosition}
				aria-label='Platform Shape'
				data-testid={dataTestId || 'platform-shape-group'}
			>
				{mesh}
				{topFace}
				{aura}
				{/* Shadow (simple soft shadow under platform) */}
				{showShadow && (
					<mesh
						position={[0, -platformHeight / 2 - 0.05, 0]}
						rotation={[-Math.PI / 2, 0, 0]}
					>
						<circleGeometry
							args={[platformSize * 1.2, 32]}
						/>
						<meshStandardMaterial
							color='#000'
							transparent
							opacity={0.18}
						/>
					</mesh>
				)}
				{/* Custom children (e.g., effects, debug) */}
				{children}
				{/* Debug outline */}
				{debug && (
					<Edges scale={1.05} threshold={15}>
						<lineBasicMaterial color='#f00' />
					</Edges>
				)}
			</group>
		);
	} catch (err) {
		console.error(
			'[PlatformShape] Error rendering platform:',
			err,
			props
		);
		console.log(
			'[PlatformShape] about to render fallback group',
			{ err, props }
		);
		return (
			<group>
				<mesh>
					<boxGeometry args={[2, 2, 2]} />
					<meshStandardMaterial color={'#e57373'} />
				</mesh>
				{/* Fallback error label */}
				<mesh position={[0, 1.5, 0]}>
					<planeGeometry args={[1.2, 0.4]} />
					<meshBasicMaterial color={'#fff'} />
				</mesh>
			</group>
		);
	}
});
