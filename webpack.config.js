/* eslint-disable @typescript-eslint/no-var-requires */
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // If you want to add a new alias to the config.
  config.resolve.alias['../../Utilities/Platform'] =
    'react-native-web/dist/exports/Platform';
  config.resolve.alias['../Utilities/Platform'] =
    'react-native-web/dist/exports/Platform';
  config.resolve.alias['./Platform'] = 'react-native-web/dist/exports/Platform';
  config.resolve.alias['./PlatformColorValueTypes'] =
    'react-native-web/dist/exports/StyleSheet';
  config.resolve.alias['./RCTAlertManager'] =
    'react-native-web/dist/exports/Alert';
  config.resolve.alias['./RCTNetworking'] =
    'react-native-web/dist/exports/Network';

  // Maybe you want to turn off compression in dev mode.
  if (config.mode === 'development') {
    config.devServer.compress = false;
  }

  // Or prevent minimizing the bundle when you build.
  if (config.mode === 'production') {
    config.optimization.minimize = true;
  }

  // Finally return the new config for the CLI to use.
  return config;
};
