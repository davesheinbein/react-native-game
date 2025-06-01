import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

let supabase;

if (
	typeof navigator !== 'undefined' &&
	navigator.product === 'ReactNative'
) {
	// React Native: use AsyncStorage
	const AsyncStorage =
		require('@react-native-async-storage/async-storage').default;
	supabase = createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			storage: AsyncStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	});
} else {
	// Web/Node: use default storage
	supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
