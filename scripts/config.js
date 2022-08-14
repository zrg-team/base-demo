/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const projectName = 'base';

const androidIconConfig = [
  {
    dir: 'mipmap-hdpi',
    resolution: 72,
  },
  {
    dir: 'mipmap-mdpi',
    resolution: 48,
  },
  {
    dir: 'mipmap-xhdpi',
    resolution: 96,
  },
  {
    dir: 'mipmap-xxhdpi',
    resolution: 144,
  },
  {
    dir: 'mipmap-xxxhdpi',
    resolution: 192,
  },
];

try {
  fs.mkdirSync(path.resolve(__dirname, 'androidTemp'));
} catch (err) {
  console.log('androidTemp already have');
}
try {
  fs.mkdirSync(path.resolve(__dirname, 'IosTemp'));
} catch (err) {
  console.log('IosTemp already have');
}

let tempOutputDirAndroid = path.resolve(__dirname, 'androidTemp');
let tempOutputDirIOS = path.resolve(__dirname, 'IosTemp');
let productionSource = path.resolve(__dirname, '../assets/images/icon.png');

// Android specific
let androidIconRootDestination = path.resolve(
  __dirname,
  '../android/app/src/main/res',
);

let androidIconRootStagingDestination = path.resolve(
  __dirname,
  '../android/app/src/development/res',
);

let iconName = 'ic_launcher.png';
let iconRoundName = 'ic_launcher_round.png';

module.exports = {
  projectName,
  androidIconConfig,
  tempOutputDirAndroid,
  tempOutputDirIOS,
  productionSource,
  androidIconRootDestination,
  androidIconRootStagingDestination,
  iconName,
  iconRoundName,
};
