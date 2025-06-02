import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export type UserProfile = {
	nickname: string;
	avatar: string; // Could be a key to a local asset or URL
	equippedCosmetics: string[];
};

const PROFILE_KEY = 'userProfile';

export function saveUserProfile(profile: UserProfile) {
	storage.set(PROFILE_KEY, JSON.stringify(profile));
}

export function getUserProfile(): UserProfile {
	const val = storage.getString(PROFILE_KEY);
	if (val) {
		try {
			return JSON.parse(val) as UserProfile;
		} catch (e) {
			// fallback to default
		}
	}
	return {
		nickname: 'Player',
		avatar: 'default',
		equippedCosmetics: [],
	};
}

export function updateUserProfile(
	partial: Partial<UserProfile>
) {
	const current = getUserProfile();
	saveUserProfile({ ...current, ...partial });
}
