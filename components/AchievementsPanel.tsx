import React from 'react';
import {
	Animated,
	FlatList,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { colors } from '../constants/colors';
import { getAchievementProgress } from '../game/state/achievementProgress';
import { getAchievements } from '../game/state/achievements';
import { getUserStats } from '../game/state/userStats'; // Use stats, not profile

export default function AchievementsPanel() {
	const achievements = getAchievements();
	const userStats = getUserStats();

	if (!achievements.length) {
		return (
			<View style={styles.container}>
				<Text style={styles.header}>Achievements</Text>
				<Text style={styles.empty}>
					No achievements found.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Achievements</Text>
			<FlatList
				data={achievements}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingBottom: 24 }}
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
							accessible
							accessibilityLabel={
								item.unlocked ?
									`${item.title}, unlocked`
								:	`${item.title}, ${Math.round(progress * 100)}% complete`
							}
						>
							<View style={styles.iconCircle}>
								<Text
									style={
										item.unlocked ?
											styles.iconUnlocked
										:	styles.iconLocked
									}
								>
									{item.unlocked ? '🏆' : '🔒'}
								</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={styles.title}>
									{item.title}
								</Text>
								<Text style={styles.desc}>
									{item.description}
								</Text>
								{item.unlocked ?
									<Text style={styles.date}>
										Unlocked:{' '}
										{item.unlockDate?.slice(0, 10)}
									</Text>
								: progress < 1 ?
									<View style={styles.progressBarContainer}>
										<View style={styles.progressBarBg}>
											<Animated.View
												style={[
													styles.progressBar,
													{
														width: `${Math.round(progress * 100)}%`,
													},
												]}
											/>
										</View>
										<Text style={styles.progressText}>
											{Math.round(progress * 100)}% Complete
										</Text>
									</View>
								:	null}
							</View>
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
		backgroundColor: colors.background,
		padding: 24,
	},
	header: {
		fontSize: 26,
		fontWeight: 'bold',
		color: colors.accent,
		marginBottom: 18,
		letterSpacing: 1,
	},
	empty: {
		color: colors.text,
		fontSize: 16,
		textAlign: 'center',
		marginTop: 32,
	},
	achievement: {
		backgroundColor: '#232323',
		borderRadius: 14,
		padding: 18,
		marginBottom: 16,
		elevation: 2,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#333',
	},
	unlocked: {
		backgroundColor: '#2e3d1f',
		borderColor: colors.accent,
	},
	iconCircle: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: '#181818',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	iconUnlocked: {
		fontSize: 26,
		color: colors.accent,
	},
	iconLocked: {
		fontSize: 26,
		color: '#888',
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: colors.text,
		marginBottom: 2,
	},
	desc: {
		fontSize: 14,
		color: '#bbb',
		marginBottom: 4,
	},
	date: {
		fontSize: 12,
		color: colors.accent,
		marginTop: 2,
	},
	progressBarContainer: {
		marginTop: 6,
	},
	progressBarBg: {
		height: 8,
		backgroundColor: '#444',
		borderRadius: 4,
		overflow: 'hidden',
		width: '100%',
	},
	progressBar: {
		height: 8,
		backgroundColor: colors.accent,
		borderRadius: 4,
	},
	progressText: {
		fontSize: 12,
		color: '#aaa',
		marginTop: 2,
	},
});
