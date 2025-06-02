import React from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { getAchievementProgress } from '../game/state/achievementProgress';
import { getAchievements } from '../game/state/achievements';
import { getUserProfile } from '../game/state/userProfile';

export default function AchievementsPanel() {
	const achievements = getAchievements();
	const userStats = getUserProfile();

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Achievements</Text>
			<FlatList
				data={achievements}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					const progress =
						!item.unlocked ?
							getAchievementProgress(item, userStats)
						:	1;
					return (
						<View
							style={[
								styles.achievement,
								item.unlocked && styles.unlocked,
							]}
						>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={styles.desc}>
								{item.description}
							</Text>
							{item.unlocked ?
								<Text style={styles.date}>
									Unlocked: {item.unlockDate?.slice(0, 10)}
								</Text>
							: progress < 1 ?
								<View style={styles.progressBarBg}>
									<View
										style={[
											styles.progressBar,
											{
												width: `${Math.round(progress * 100)}%`,
											},
										]}
									/>
									<Text style={styles.progressText}>
										{Math.round(progress * 100)}%
									</Text>
								</View>
							:	null}
						</View>
					);
				}}
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
	achievement: {
		padding: 12,
		marginVertical: 6,
		borderWidth: 1,
		borderColor: '#aaa',
		borderRadius: 8,
		backgroundColor: '#eee',
	},
	unlocked: {
		backgroundColor: '#c0ffd0',
		borderColor: '#4caf50',
	},
	title: { fontWeight: 'bold', fontSize: 16 },
	desc: { color: '#555' },
	date: { fontSize: 12, color: '#888', marginTop: 4 },
	progressBarBg: {
		height: 16,
		backgroundColor: '#ddd',
		borderRadius: 8,
		marginTop: 8,
		marginBottom: 2,
		width: '100%',
		position: 'relative',
	},
	progressBar: {
		height: 16,
		backgroundColor: '#ffd600',
		borderRadius: 8,
		position: 'absolute',
		left: 0,
		top: 0,
	},
	progressText: {
		position: 'absolute',
		width: '100%',
		textAlign: 'center',
		color: '#222',
		fontSize: 12,
		fontWeight: 'bold',
	},
});
