import React from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	getCurrentTrackIndex,
	getMusicTracks,
	setMusicTrack,
} from '../game/audio/music';

export default function MusicTrackSelector({
	onClose,
}: {
	onClose: () => void;
}) {
	const tracks = getMusicTracks();
	const current = getCurrentTrackIndex();

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Select Music Track</Text>
			<FlatList
				data={tracks}
				keyExtractor={(item, idx) => idx.toString()}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						style={[
							styles.track,
							index === current && styles.selected,
						]}
						onPress={() => setMusicTrack(index)}
					>
						<Text style={styles.trackText}>
							{item.title || `Track ${index + 1}`}
						</Text>
					</TouchableOpacity>
				)}
			/>
			<TouchableOpacity
				onPress={onClose}
				style={styles.closeBtn}
			>
				<Text style={styles.closeText}>Close</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		padding: 24,
		borderRadius: 12,
		alignItems: 'center',
		width: 320,
	},
	header: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	track: {
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
		backgroundColor: '#eee',
		width: 240,
		alignItems: 'center',
	},
	selected: {
		backgroundColor: '#ffd600',
	},
	trackText: {
		fontSize: 16,
	},
	closeBtn: {
		marginTop: 16,
		padding: 8,
		backgroundColor: '#ffd600',
		borderRadius: 8,
	},
	closeText: {
		fontWeight: 'bold',
		color: '#222',
	},
});
