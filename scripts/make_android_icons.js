/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const sharp = require('sharp');

const appConfig = require('./config.js');
const {
  tempOutputDirAndroid,
  productionSource,
  productionSourceSplash,
  androidIconConfig,
  androidIconRootStagingDestination,
  androidIconRootDestination,
  iconName,
  iconRoundName,
  splashName,
} = appConfig;

const utility = require('./utility.js');
const { clearFolder } = utility;

let androidIconTempOutput = `${tempOutputDirAndroid}/`;

let createTempDirectories = () => {
  return new Promise(resolve => {
    androidIconConfig.forEach(elem => {
      let dirToMake = androidIconTempOutput + elem.dir;
      console.log('Make temp dir: ', dirToMake);
      fs.mkdirSync(dirToMake);
    });
    resolve();
  });
};

let generateAndroidIconsFromSource = () => {
  return new Promise((resolve, reject) => {
    let sourceFile = productionSource;
    // read source image
    let sourceImage = fs.readFileSync(sourceFile);
    let copyCompletedCount = 0;
    // iterate through options
    androidIconConfig.forEach(elem => {
      let thisNewFilename = elem.dir + '/' + iconName;
      let outputFileName = androidIconTempOutput + thisNewFilename;
      // // handle image processing
      sharp(sourceImage)
        .resize(elem.resolution, elem.resolution)
        .toFile(outputFileName, err => {
          if (err) reject(err);
          copyCompletedCount++;
          console.log('Resize success: ', thisNewFilename);
          if (copyCompletedCount >= androidIconConfig.length) {
            resolve();
          }
        });
    });
  });
};

let generateAndroidIconsFromSourceRound = () => {
  return new Promise((resolve, reject) => {
    let sourceFile = productionSource;
    // read source image
    let sourceImage = fs.readFileSync(sourceFile);
    let copyCompletedCount = 0;
    // iterate through options
    androidIconConfig.forEach(elem => {
      let thisNewFilename = elem.dir + '/' + iconRoundName;
      let outputFileName = androidIconTempOutput + thisNewFilename;
      // // handle image processing
      sharp(sourceImage)
        .resize(elem.resolution, elem.resolution)
        .toFile(outputFileName, err => {
          if (err) reject(err);
          copyCompletedCount++;
          console.log('Resize success: ', thisNewFilename);
          if (copyCompletedCount >= androidIconConfig.length) {
            resolve();
          }
        });
    });
  });
};

let copyImagesToDestinationAndroid = staging => {
  return new Promise(resolve => {
    console.log('Copy images to android destination');
    let completeCount = 0;
    androidIconConfig.forEach(elem => {
      let thisItemFullSourceUrl =
        androidIconTempOutput + elem.dir + '/' + iconName;
      const destRootFolder = staging
        ? androidIconRootStagingDestination
        : androidIconRootDestination;
      let thisItemFullDestinationUrl =
        destRootFolder + '/' + elem.dir + '/' + iconName;
      // copy files to destination
      let writeStream = fs.createWriteStream(thisItemFullDestinationUrl);
      let readStream = fs.createReadStream(thisItemFullSourceUrl);
      writeStream.on('close', () => {
        console.log('Successfully copied to android destination: ', elem.dir);
        completeCount++;
        if (completeCount >= androidIconConfig.length) {
          resolve();
        }
      });
      readStream.on('end', () => {
        writeStream.close();
      });
      readStream.pipe(writeStream);
    });
  });
};

let copyImagesToDestinationAndroidRound = staging => {
  return new Promise(resolve => {
    console.log('Copy images to android destination');
    let completeCount = 0;
    androidIconConfig.forEach(elem => {
      let thisItemFullSourceUrl =
        androidIconTempOutput + elem.dir + '/' + iconRoundName;
      const destRootFolder = staging
        ? androidIconRootStagingDestination
        : androidIconRootDestination;
      let thisItemFullDestinationUrl =
        destRootFolder + '/' + elem.dir + '/' + iconRoundName;
      // copy files to destination
      let writeStream = fs.createWriteStream(thisItemFullDestinationUrl);
      let readStream = fs.createReadStream(thisItemFullSourceUrl);
      writeStream.on('close', () => {
        console.log('Successfully copied to android destination: ', elem.dir);
        completeCount++;
        if (completeCount >= androidIconConfig.length) {
          resolve();
        }
      });
      readStream.on('end', () => {
        writeStream.close();
      });
      readStream.pipe(writeStream);
    });
  });
};

const copySplashImagesToDestinationAndroid = staging => {
  return new Promise(resolve => {
    console.log('Copy splash images to android destination');
    let completeCount = 0;
    androidIconConfig.forEach(elem => {
      let thisItemFullSourceUrl = productionSourceSplash;
      const destRootFolder = staging
        ? androidIconRootStagingDestination
        : androidIconRootDestination;
      let thisItemFullDestinationUrl =
        destRootFolder + '/' + elem.dir + '/' + splashName;
      // copy files to destination
      let writeStream = fs.createWriteStream(thisItemFullDestinationUrl);
      let readStream = fs.createReadStream(thisItemFullSourceUrl);
      writeStream.on('close', () => {
        console.log('Successfully copied to android destination: ', elem.dir);
        completeCount++;
        if (completeCount >= androidIconConfig.length) {
          resolve();
        }
      });
      readStream.on('end', () => {
        writeStream.close();
      });
      readStream.pipe(writeStream);
    });
  });
};

const makeAndroidIcons = async () => {
  try {
    console.log(
      '======================== Make android icons ========================',
    );
    await clearFolder(androidIconTempOutput);
    await createTempDirectories();
    await generateAndroidIconsFromSource();
    await generateAndroidIconsFromSourceRound();
    await copyImagesToDestinationAndroid();
    await copyImagesToDestinationAndroidRound();
    await copyImagesToDestinationAndroid(true);
    await copyImagesToDestinationAndroidRound(true);
    await copySplashImagesToDestinationAndroid();
    await copySplashImagesToDestinationAndroid(true);
    await clearFolder(androidIconTempOutput);
    console.log(
      '======================== Done with Android ========================',
    );
  } catch (err) {
    console.log('Error copying android', err);
  }
};

module.exports = {
  makeAndroidIcons,
};
