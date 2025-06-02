const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = {
	...config.resolver,
	unstable_enablePackageExports: true,
	sourceExts: config.resolver.sourceExts || [],
};

module.exports = config;
