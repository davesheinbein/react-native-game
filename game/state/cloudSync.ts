// This is a stub for cloud sync and authentication. Replace with Firebase or other backend as needed.
export function signInWithProvider(provider) {
	// TODO: Implement real sign-in
	return Promise.resolve({
		user: { id: 'demo', name: 'Demo User' },
	});
}

export function syncProfileToCloud(profile) {
	// TODO: Implement real sync
	return Promise.resolve(true);
}

export function fetchProfileFromCloud(userId) {
	// TODO: Implement real fetch
	return Promise.resolve({
		id: userId,
		name: 'Demo User',
		avatar: '',
	});
}
