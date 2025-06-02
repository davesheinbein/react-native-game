import React from 'react';
import { Button, Text, View } from 'react-native';

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends React.Component<
	{
		children: React.ReactNode;
	},
	ErrorBoundaryState
> {
	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: any) {
		// Log error to analytics or remote service
		console.error('ErrorBoundary caught:', error, info);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			return (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						padding: 24,
					}}
				>
					<Text style={{ fontSize: 18, marginBottom: 12 }}>
						Something went wrong.
					</Text>
					<Text
						selectable
						style={{ color: 'gray', marginBottom: 16 }}
					>
						{this.state.error?.message}
					</Text>
					<Button
						title='Try Again'
						onPress={this.handleReset}
					/>
				</View>
			);
		}
		return this.props.children;
	}
}
