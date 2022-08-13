const makeAndroidIcons = require('./make_android_icons.js').makeAndroidIcons;
const makeIosIcons = require('./make_ios_icons').makeIOSIcons;

async function start() {
  console.log('Generating React Native Icons');
  await makeAndroidIcons();
  await makeIosIcons();
  console.log('Icons Created!!!!!!!!!!');
}

start();
