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

export default function AvatarPicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<View style={styles.row}>
			{builtInAvatars.map((img, idx) => (
				<TouchableOpacity
					key={idx}
					onPress={() => onChange(img)}
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
