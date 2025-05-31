const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
	...config.resolver.extraNodeModules,
};

config.transformer = {
	...config.transformer,
	unstable_disableES6Transforms: true,
};

module.exports = config;
