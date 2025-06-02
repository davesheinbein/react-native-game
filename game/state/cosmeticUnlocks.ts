import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export type Cosmetic = {
	id: string;
	name: string;
	type: 'color' | 'hat' | 'accessory';
	unlocked: boolean;
};

const COSMETICS_KEY = 'cosmeticUnlocks';

export function getCosmetics(): Cosmetic[] {
	const val = storage.getString(COSMETICS_KEY);
	if (val) {
		try {
			return JSON.parse(val) as Cosmetic[];
		} catch {}
	}
	return [];
}

export function unlockCosmetic(id: string) {
	const cosmetics = getCosmetics();
	const updated = cosmetics.map((c) =>
		c.id === id ? { ...c, unlocked: true } : c
	);
	storage.set(COSMETICS_KEY, JSON.stringify(updated));
}

export function addCosmetic(cosmetic: Cosmetic) {
	const cosmetics = getCosmetics();
	if (!cosmetics.find((c) => c.id === cosmetic.id)) {
		cosmetics.push(cosmetic);
		storage.set(COSMETICS_KEY, JSON.stringify(cosmetics));
	}
}
