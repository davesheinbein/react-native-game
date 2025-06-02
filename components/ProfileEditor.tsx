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
import AvatarPicker from './AvatarPicker';

/**
 * ProfileEditor: Edit user profile with avatar picker and name validation.
 * - Modern UI/UX: avatar preview/picker, input validation, feedback on save.
 * - Accessibility: labels and roles for all controls.
 * - Consistent styling and layout.
 */

export default function ProfileEditor({
	onClose,
}: {
	onClose: () => void;
}) {
	const [profile, setProfile] = useState(getUserProfile());
	const [name, setName] = useState(profile.nickname || '');
	const [avatar, setAvatar] = useState(
		profile.avatar || ''
	);
	const [error, setError] = useState('');
	const [saving, setSaving] = useState(false);

	const handleSave = () => {
		if (!name.trim()) {
			setError('Name cannot be empty.');
			return;
		}
		setSaving(true);
		updateUserProfile({ nickname: name, avatar });
		setProfile(getUserProfile());
		setTimeout(() => {
			setSaving(false);
			onClose();
		}, 400);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Edit Profile</Text>
			<AvatarPicker value={avatar} onChange={setAvatar} />
			{name || avatar ?
				avatar ?
					<Image
						source={{ uri: avatar }}
						style={styles.avatar}
					/>
				:	null
			:	null}
			<TextInput
				style={styles.input}
				value={name}
				onChangeText={setName}
				placeholder='Enter your nickname'
				accessibilityLabel='Nickname'
				maxLength={18}
			/>
			{error ?
				<Text style={{ color: '#e57373', marginBottom: 8 }}>
					{error}
				</Text>
			:	null}
			<Button
				title={saving ? 'Saving...' : 'Save'}
				onPress={handleSave}
				disabled={saving}
			/>
			<Button
				title='Cancel'
				onPress={onClose}
				color='#888'
				accessibilityLabel='Cancel editing profile'
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
