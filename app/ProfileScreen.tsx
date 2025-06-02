import React, { useState } from 'react';
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { getCosmetics } from '../game/state/cosmeticUnlocks';
import {
	getUserProfile,
	updateUserProfile,
} from '../game/state/userProfile';

export default function ProfileScreen() {
	const [profile, setProfile] = useState(getUserProfile());
	const [nickname, setNickname] = useState(
		profile.nickname
	);
	const cosmetics = getCosmetics().filter(
		(c) => c.unlocked
	);
	const [equipped, setEquipped] = useState(
		profile.equippedCosmetics
	);

	const handleSave = () => {
		updateUserProfile({
			nickname,
			equippedCosmetics: equipped,
		});
		setProfile(getUserProfile());
	};

	const toggleEquip = (id: string) => {
		setEquipped(
			equipped.includes(id) ?
				equipped.filter((e) => e !== id)
			:	[...equipped, id]
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Profile</Text>
			<Text>Nickname:</Text>
			<TextInput
				style={styles.input}
				value={nickname}
				onChangeText={setNickname}
				placeholder='Enter nickname'
				maxLength={16}
			/>
			<Text style={styles.subheader}>
				Unlocked Cosmetics
			</Text>
			<FlatList
				data={cosmetics}
				keyExtractor={(item) => item.id}
				horizontal
				renderItem={({ item }) => (
					<TouchableOpacity
						style={[
							styles.cosmetic,
							equipped.includes(item.id) && styles.equipped,
						]}
						onPress={() => toggleEquip(item.id)}
					>
						{/* Replace with actual images if available */}
						<Text>{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
			<Button title='Save Profile' onPress={handleSave} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: '#fff',
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	subheader: {
		fontSize: 18,
		marginTop: 24,
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		padding: 8,
		marginBottom: 16,
	},
	cosmetic: {
		padding: 12,
		margin: 4,
		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 8,
	},
	equipped: { backgroundColor: '#d0f0c0' },
});
