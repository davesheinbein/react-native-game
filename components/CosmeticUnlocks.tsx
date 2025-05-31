import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { gameStyles } from '../app/gameStyles';

export function CosmeticUnlocks({ cosmeticUnlocks }) {
	if (!cosmeticUnlocks || cosmeticUnlocks.length === 0)
		return null;
	return (
		<View style={gameStyles.cosmetics}>
			<Text style={gameStyles.cosmeticsTitle}>
				Unlocked Cosmetics:
			</Text>
			<FlatList
				data={cosmeticUnlocks}
				keyExtractor={(item) => item}
				renderItem={({ item }) => (
					<Text style={gameStyles.cosmeticItem}>
						{item}
					</Text>
				)}
				horizontal
			/>
		</View>
	);
}
