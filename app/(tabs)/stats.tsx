import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function StatsScreen() {
	return (
		<ThemedView
			style={{
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<ThemedText type='title'>Survival Stats</ThemedText>
			<ThemedText>
				Coming soon: Your existential journey, quantified.
			</ThemedText>
		</ThemedView>
	);
}
