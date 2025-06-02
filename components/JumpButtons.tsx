import React from 'react';
import { Button, Platform, View } from 'react-native';
import { gameStyles } from '../constants/gameStyles';
import { useCheatSafeSides } from '../game/cheatcode';

interface JumpButtonsProps {
	sides: number;
	safeSides: number[];
	mode: string;
	handleJump: (side: number) => void;
}

export function JumpButtons({
	sides,
	safeSides,
	mode,
	handleJump,
	onHover,
}: JumpButtonsProps & {
	onHover?: (side: number | null) => void;
}) {
	const [showSafeSides] = useCheatSafeSides();
	const [hovered, setHovered] = React.useState<
		number | null
	>(null);
	return (
		<View style={gameStyles.buttonRow}>
			{Array.from({ length: sides }).map((_, i) => {
				const mouseEvents =
					Platform.OS === 'web' && onHover ?
						{
							onMouseEnter: () => {
								onHover(i);
								setHovered(i);
							},
							onMouseLeave: () => {
								onHover(null);
								setHovered(null);
							},
						}
					:	{};
				let color = undefined;
				if (showSafeSides && safeSides.includes(i)) {
					color = '#4caf50'; // green for safe sides when cheat is active
				} else if (hovered === i) {
					color = '#ffd600'; // yellow on hover (only if not safe+cheat)
				}
				return (
					<View
						key={i}
						style={gameStyles.buttonWrapper}
						{...mouseEvents}
					>
						<Button
							title={`Jump Side ${i + 1}`}
							onPress={() => handleJump(i)}
							color={color}
						/>
					</View>
				);
			})}
		</View>
	);
}
