import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export type Settings = {
	musicVolume: number; // 0-1
	sfxVolume: number; // 0-1
	narration: boolean;
	colorBlindMode: boolean;
	haptics: boolean;
};

const SETTINGS_KEY = 'settings';

const defaultSettings: Settings = {
	musicVolume: 0.7,
	sfxVolume: 0.7,
	narration: true,
	colorBlindMode: false,
	haptics: true,
};

export function getSettings(): Settings {
	const val = storage.getString(SETTINGS_KEY);
	if (val) {
		try {
			return {
				...defaultSettings,
				...JSON.parse(val),
			} as Settings;
		} catch {}
	}
	return defaultSettings;
}

export function saveSettings(settings: Settings) {
	storage.set(SETTINGS_KEY, JSON.stringify(settings));
}

export function updateSettings(partial: Partial<Settings>) {
	const current = getSettings();
	saveSettings({ ...current, ...partial });
}
