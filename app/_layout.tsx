import { Stack } from 'expo-router';
import { ToastProvider } from '../components/ToastProvider';

export default function RootLayout() {
	return (
		<ToastProvider>
			<Stack />
		</ToastProvider>
	);
}
