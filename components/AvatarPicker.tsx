import React from 'react';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

const builtInAvatars = [
	require('../assets/images/avatar1.png'),
	require('../assets/images/avatar2.png'),
	require('../assets/images/avatar3.png'),
];

/**
 * AvatarPicker: Choose from built-in avatars or use a custom URL.
 * - Highlights selected avatar
 * - Calls onChange with avatar URI or require() object
 * - Accessible and visually clear
 */

export default function AvatarPicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) {
	const isCustom = value && !builtInAvatars.includes(value);
	return (
		<View style={styles.row}>
			{builtInAvatars.map((img, idx) => (
				<TouchableOpacity
					key={idx}
					onPress={() => onChange(img)}
					accessibilityRole='button'
					accessibilityLabel={`Select avatar ${idx + 1}`}
				>
					<Image
						source={img}
						style={[
							styles.avatar,
							value === img && styles.selected,
						]}
					/>
				</TouchableOpacity>
			))}
			{/* Show custom avatar if set and not built-in */}
			{isCustom ?
				<TouchableOpacity
					onPress={() => onChange(value)}
					accessibilityRole='button'
					accessibilityLabel='Select custom avatar'
				>
					<Image
						source={{ uri: value }}
						style={[styles.avatar, styles.selected]}
					/>
				</TouchableOpacity>
			:	null}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		marginVertical: 8,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		marginHorizontal: 6,
		borderWidth: 2,
		borderColor: 'transparent',
	},
	selected: {
		borderColor: '#ffd600',
	},
});
