import React, {
	createContext,
	useCallback,
	useContext,
	useState,
} from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface ToastContextType {
	showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
	showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [message, setMessage] = useState<string | null>(
		null
	);
	const [visible, setVisible] = useState(false);
	const opacity = React.useRef(
		new Animated.Value(0)
	).current;

	const showToast = useCallback(
		(msg: string, duration = 2000) => {
			setMessage(msg);
			setVisible(true);
			Animated.timing(opacity, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}).start();
			setTimeout(() => {
				Animated.timing(opacity, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}).start(() => {
					setVisible(false);
					setMessage(null);
				});
			}, duration);
		},
		[opacity]
	);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{visible && message && (
				<Animated.View style={[styles.toast, { opacity }]}>
					<Text style={styles.toastText}>{message}</Text>
				</Animated.View>
			)}
		</ToastContext.Provider>
	);
};

const styles = StyleSheet.create({
	toast: {
		position: 'absolute',
		bottom: 40,
		left: 20,
		right: 20,
		backgroundColor: '#222',
		borderRadius: 8,
		padding: 16,
		alignItems: 'center',
		zIndex: 1000,
	},
	toastText: {
		color: '#fff',
		fontSize: 16,
	},
});
