import React, { useState } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	getCosmetics,
	unlockCosmetic,
} from '../game/state/cosmeticUnlocks';
import {
	getUserProfile,
	updateUserProfile,
} from '../game/state/userProfile';
import CosmeticPreview from './CosmeticPreview';

/**
 * CosmeticsPanel: View, unlock, and equip cosmetics.
 * - Shows preview for each cosmetic
 * - Clear feedback for equip/unlock
 * - Accessible and modern UI
 */

export default function CosmeticsPanel() {
	const [cosmetics, setCosmetics] =
		useState(getCosmetics());
	const [profile, setProfile] = useState(getUserProfile());

	const handleEquip = (id: string) => {
		updateUserProfile({ equippedCosmetics: [id] });
		setProfile(getUserProfile());
	};

	const handleUnlock = (id: string) => {
		unlockCosmetic(id);
		setCosmetics(getCosmetics());
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Cosmetics</Text>
			<FlatList
				data={cosmetics}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View
						style={[
							styles.cosmetic,
							item.unlocked && styles.unlocked,
						]}
					>
						<CosmeticPreview cosmetic={item} />
						<Text
							style={{
								fontWeight: 'bold',
								marginBottom: 4,
							}}
						>
							{item.name}
						</Text>
						{item.unlocked ?
							<TouchableOpacity
								onPress={() => handleEquip(item.id)}
								accessibilityRole='button'
								accessibilityLabel={`Equip ${item.name}`}
							>
								<Text
									style={
										(
											profile.equippedCosmetics.includes(
												item.id
											)
										) ?
											styles.equipped
										:	styles.equipBtn
									}
								>
									{(
										profile.equippedCosmetics.includes(
											item.id
										)
									) ?
										'Equipped'
									:	'Equip'}
								</Text>
							</TouchableOpacity>
						:	<TouchableOpacity
								onPress={() => handleUnlock(item.id)}
								accessibilityRole='button'
								accessibilityLabel={`Unlock ${item.name}`}
							>
								<Text style={styles.unlockBtn}>Unlock</Text>
							</TouchableOpacity>
						}
					</View>
				)}
			/>
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
	cosmetic: {
		padding: 12,
		marginVertical: 6,
		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 8,
		backgroundColor: '#eee',
	},
	unlocked: {
		backgroundColor: '#e0f7fa',
		borderColor: '#00bcd4',
	},
	equipBtn: { color: '#007aff', marginTop: 8 },
	equipped: {
		color: '#388e3c',
		fontWeight: 'bold',
		marginTop: 8,
	},
	unlockBtn: { color: '#ff9800', marginTop: 8 },
});
