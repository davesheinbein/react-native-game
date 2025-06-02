import React, { useState } from 'react';
import {
	Button,
	Image,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import {
	getUserProfile,
	updateUserProfile,
} from '../game/state/userProfile';

export default function ProfileEditor({
	onClose,
}: {
	onClose: () => void;
}) {
	const [profile, setProfile] = useState(getUserProfile());
	const [name, setName] = useState(profile.name || '');
	const [avatar, setAvatar] = useState(
		profile.avatar || ''
	);

	const handleSave = () => {
		updateUserProfile({ name, avatar });
		setProfile(getUserProfile());
		onClose();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Edit Profile</Text>
			<TextInput
				style={styles.input}
				value={name}
				onChangeText={setName}
				placeholder='Enter your name'
			/>
			<TextInput
				style={styles.input}
				value={avatar}
				onChangeText={setAvatar}
				placeholder='Avatar URL (optional)'
			/>
			{avatar ?
				<Image
					source={{ uri: avatar }}
					style={styles.avatar}
				/>
			:	null}
			<Button title='Save' onPress={handleSave} />
			<Button
				title='Cancel'
				onPress={onClose}
				color='#888'
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 24,
		backgroundColor: '#fff',
		borderRadius: 12,
		alignItems: 'center',
	},
	header: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 8,
		padding: 8,
		marginBottom: 12,
		width: 200,
	},
	avatar: {
		width: 64,
		height: 64,
		borderRadius: 32,
		marginBottom: 12,
	},
});
