module.exports = function (api) {
  const tsconfig = require('./tsconfig.json');
  api.cache(false);
  const alias = Object.keys(tsconfig.compilerOptions.paths).reduce(
    (all, key) => {
      const item = tsconfig.compilerOptions.paths[key][0];
      return {...all, [key.replace('/*', '')]: `./${item}`.replace('/*', '')};
    },
    {},
  );
  return {
    presets: ['module:metro-react-native-babel-preset', 'babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias,
          extensions: [
            '.android.js',
            '.ios.js',
            '.js',
            '.web.js',
            '.android.ts',
            '.ios.ts',
            '.ts',
            '.web.ts',
            '.android.tsx',
            '.ios.tsx',
            '.tsx',
            '.web.tsx',
          ],
        },
      ],
      'react-native-reanimated/plugin',
      '@babel/plugin-proposal-export-namespace-from'
    ],
  };
};
