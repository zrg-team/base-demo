/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const appConfig = require('./config.js');
const { productionSource, tempOutputDirIOS } =
  appConfig;

const utility = require('./utility.js');
const { clearFolder } = utility;

const iosIconTempOutput = `${tempOutputDirIOS}/`;

let iosDestination = path.resolve(
  __dirname,
  '../ios/' + appConfig.projectName + '/Images.xcassets/',
);

let iosImageDestinationDir = iosDestination + '/AppIcon.appiconset/';
let iosContentsJsonUrl = iosDestination + '/AppIcon.appiconset/Contents.json';

// init storage variables
// ios Contents.json file will be copied and manipulated in our script using this variable
let iOSIconSetJSON = null;

let config = {
  iosMode: true,
  androidMode: true,
  iosBaseFilname: 'AppIcon',
  iosOutputJSONFilename: 'Contents.json',
};

// Just handle production for now
let generateIOSIconsFromSource = () => {
  return new Promise((resolve, reject) => {
    console.log('Gerate iOS icons from source');
    // grab source image before starting
    let sourceFile = productionSource;
    let sourceImage = fs.readFileSync(sourceFile);
    // pull sizes out of iOS JSON
    let completeCount = 0;
    iOSIconSetJSON.images.forEach((eachImgConfig, i) => {
      // console.log(eachImgConfig);
      let sizeString = eachImgConfig.size;
      let height = sizeString.split('x')[0];
      let width = sizeString.split('x')[1];
      let scale = eachImgConfig.scale.split('')[0];
      let scaledWidth = width * scale;
      let scaledHeight = height * scale;
      let thisNewFilename =
        config.iosBaseFilname + scaledWidth + 'x' + scaledHeight + '.png';
      let outputFileName = iosIconTempOutput + '/' + thisNewFilename;
      // handle image processing
      sharp(sourceImage)
        .resize(scaledWidth, scaledHeight)
        .toFile(outputFileName, err => {
          if (err) reject(err);
          console.log('Resize success: ', thisNewFilename);
          // write file name into temp json
          iOSIconSetJSON.images[i].filename = thisNewFilename;
          // increment count and then resolve!!
          completeCount++;
          if (completeCount === iOSIconSetJSON.images.length) resolve();
        });
    });
  });
};

let writeiOSContentsJson = () => {
  return new Promise(resolve => {
    let fileName = config.iosOutputJSONFilename;
    let tempOutputFile = iosIconTempOutput + fileName;
    fs.writeFileSync(tempOutputFile, JSON.stringify(iOSIconSetJSON, null, 2));
    console.log('Temporarily copying ' + fileName + ' to edit later');
    resolve();
  });
};

let getIOSIconSetContentsJson = () => {
  return new Promise((resolve, reject) => {
    let contentsJsonUTF8 = fs.readFileSync(iosContentsJsonUrl, 'utf8');
    let contentsJSON = JSON.parse(contentsJsonUTF8);
    if (!contentsJSON) reject();
    resolve(contentsJSON);
  });
};

let completeCount = 0;

let copyImagesToDestinationIOS = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(iosIconTempOutput, (err, items) => {
      if (err) {
        reject(err);
      }
      completeCount = 0;
      for (let i = 0; i < items.length; i++) {
        let eachItem = items[i];
        let thisItemFullSourceUrl = iosIconTempOutput + eachItem;
        let thisItemFullDestinationUrl =
          iosImageDestinationDir + '/' + eachItem;
        // copy files to destination
        let writeStream = fs.createWriteStream(thisItemFullDestinationUrl);
        let readStream = fs.createReadStream(thisItemFullSourceUrl);
        writeStream.on('close', () => {
          console.log(
            'Successfully copied ' + eachItem + ' to xCode icon location',
          );
          completeCount++;
          if (completeCount === items.length) {
            resolve();
          }
        });
        readStream.on('end', () => {
          writeStream.close();
        });
        readStream.pipe(writeStream);
      }
    });
  });
};

let copyiOSJsonDataToDestination = () => {
  return new Promise(resolve => {
    let tempSource = iosIconTempOutput + config.iosOutputJSONFilename;
    let readStream = fs.createReadStream(tempSource);
    let writeStream = fs.createWriteStream(iosContentsJsonUrl);
    writeStream.on('close', () => {
      console.log('Successfully overwrote Contents.json in xcode');
      resolve();
    });
    readStream.on('end', () => {
      writeStream.close();
    });
    readStream.pipe(writeStream);
  });
};

let copyAllIOSData = async () => {
  await copyImagesToDestinationIOS();
  await copyiOSJsonDataToDestination();
};

const makeIOSIcons = async () => {
  try {
    console.log(
      '======================== Make IOS icons ========================',
    );
    iOSIconSetJSON = await getIOSIconSetContentsJson();
    await clearFolder(iosIconTempOutput);
    await generateIOSIconsFromSource();
    await writeiOSContentsJson();
    await copyAllIOSData();
    await clearFolder(iosIconTempOutput);
    console.log(
      '======================== Done with IOS ========================',
    );
  } catch (err) {
    console.log('Error copying ios', err);
  }
};

module.exports = {
  makeIOSIcons,
};
