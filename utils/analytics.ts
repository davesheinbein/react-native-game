// Simple analytics utility. Replace with real analytics SDK as needed.

export type AnalyticsEvent = {
	type: string;
	payload?: Record<string, any>;
	timestamp?: string;
};

const events: AnalyticsEvent[] = [];

export function logEvent(
	type: string,
	payload?: Record<string, any>
) {
	const event: AnalyticsEvent = {
		type,
		payload,
		timestamp: new Date().toISOString(),
	};
	events.push(event);
	// TODO: send to remote endpoint if needed
	if (__DEV__) {
		console.log('[Analytics]', event);
	}
}

export function getLoggedEvents() {
	return events;
}
