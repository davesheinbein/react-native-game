import { StyleSheet } from 'react-native';

export const gameStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#181c24',
		alignItems: 'center', // FlexAlignType
		justifyContent: 'flex-start', // FlexAlignType
		paddingTop: 32,
	},
	title: {
		fontSize: 32,
		fontWeight: '700', // Use numeric string for RN compatibility
		color: '#ffd600',
		marginBottom: 18,
		letterSpacing: 2,
		textShadowColor: '#000a',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 8,
	},
	round: {
		fontSize: 18,
		color: '#fff',
		fontWeight: '600',
		marginBottom: 2,
		letterSpacing: 1,
	},
	shape: {
		fontSize: 16,
		color: '#ffd600',
		fontWeight: '500',
		marginBottom: 2,
		letterSpacing: 1,
	},
	narration: {
		fontSize: 16,
		color: '#b2ebf2',
		fontStyle: 'italic', // 'italic' is valid
		marginBottom: 2,
		textAlign: 'center',
		paddingHorizontal: 12,
	},
	streak: {
		fontSize: 16,
		color: '#81c784',
		fontWeight: '700',
		marginBottom: 10,
		letterSpacing: 1,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 12,
		gap: 8,
	},
	buttonWrapper: {
		marginHorizontal: 4,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: '#23272f',
		elevation: 2,
	},
	modeRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 10,
		gap: 8,
	},
	choices: {
		marginTop: 10,
		marginBottom: 10,
		alignItems: 'center',
		backgroundColor: '#23272f',
		borderRadius: 12,
		padding: 10,
		width: '90%',
		alignSelf: 'center',
		elevation: 2,
	},
	choicesTitle: {
		fontSize: 16,
		color: '#ffd600',
		fontWeight: 'bold',
		marginBottom: 6,
	},
	cosmetics: {
		marginTop: 10,
		marginBottom: 10,
		alignItems: 'center',
		backgroundColor: '#23272f',
		borderRadius: 12,
		padding: 10,
		width: '90%',
		alignSelf: 'center',
		elevation: 2,
	},
	cosmeticsTitle: {
		fontSize: 16,
		color: '#ffd600',
		fontWeight: 'bold',
		marginBottom: 6,
	},
	cosmeticItem: {
		fontSize: 14,
		color: '#fff',
		backgroundColor: '#4caf50',
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginHorizontal: 4,
		marginBottom: 4,
		overflow: 'hidden',
	},
	scoreboardContainer: {
		backgroundColor: '#23272f',
		borderRadius: 12,
		padding: 10,
		width: '90%',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: 10,
		elevation: 2,
	},
	scoreboardTitle: {
		fontSize: 18,
		color: '#ffd600',
		fontWeight: 'bold',
		marginBottom: 8,
		textAlign: 'center',
	},
	scoreboardRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
		paddingVertical: 2,
	},
	scoreboardRank: {
		fontSize: 16,
		color: '#ffd600',
		width: 28,
		textAlign: 'right',
		fontWeight: 'bold',
	},
	scoreboardName: {
		fontSize: 16,
		color: '#fff',
		flex: 1,
		marginLeft: 8,
	},
	scoreboardScore: {
		fontSize: 16,
		color: '#81c784',
		fontWeight: 'bold',
		width: 48,
		textAlign: 'right',
	},
	notFoundContainer: {
		flex: 1,
		backgroundColor: '#181c24',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
	},
	notFoundTitle: {
		fontSize: 28,
		color: '#ffd600',
		fontWeight: 'bold',
		marginBottom: 12,
		textAlign: 'center',
	},
	notFoundMessage: {
		fontSize: 16,
		color: '#fff',
		textAlign: 'center',
		marginBottom: 8,
	},
});
