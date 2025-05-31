import { StyleSheet } from 'react-native';

export const gameStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
	},
	title: {
		color: '#fff',
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	modeRow: {
		flexDirection: 'row',
		marginBottom: 8,
		gap: 4,
	},
	notFoundContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#111',
		padding: 24,
	},
	notFoundTitle: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#ffd600',
		marginBottom: 16,
	},
	notFoundMessage: {
		fontSize: 18,
		color: '#fff',
		textAlign: 'center',
		lineHeight: 28,
	},
	round: { color: '#fff', fontSize: 20, marginBottom: 2 },
	shape: { color: '#aaa', fontSize: 16, marginBottom: 8 },
	narration: {
		color: '#fffa',
		fontSize: 16,
		marginBottom: 16,
		textAlign: 'center',
		minHeight: 40,
	},
	streak: {
		color: '#ffd600',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	cosmetics: {
		marginTop: 16,
		marginBottom: 16,
		alignItems: 'center',
	},
	cosmeticsTitle: {
		color: '#ffd600',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	cosmeticItem: {
		color: '#fff',
		fontSize: 16,
		marginBottom: 4,
	},
	choices: {
		marginTop: 16,
		marginBottom: 16,
		alignItems: 'center',
	},
	choicesTitle: {
		color: '#ffd600',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 12,
	},
	buttonWrapper: {
		marginHorizontal: 8,
	},
	scoreboardContainer: {
		marginTop: 24,
		backgroundColor: '#222',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
	},
	scoreboardTitle: {
		color: '#ffd600',
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	scoreboardRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 220,
		marginBottom: 6,
	},
	scoreboardRank: {
		color: '#ffd600',
		fontWeight: 'bold',
		width: 30,
	},
	scoreboardName: {
		color: '#fff',
		width: 120,
	},
	scoreboardScore: {
		color: '#fff',
		width: 50,
		textAlign: 'right',
	},
});
