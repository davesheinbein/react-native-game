import React from 'react';
import { View } from 'react-native';
import CosmeticsPanel from '../components/CosmeticsPanel';

export default function CosmeticsScreen() {
	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<CosmeticsPanel />
		</View>
	);
}
