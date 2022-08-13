const fs = require('fs');
var rimraf = require('rimraf');

let clearFolder = (path) => {
  return new Promise((resolve, reject) => {
    // yeah, lets avoid this
    if (path === '/') {
      reject('Please do not delete this: ' + path);
    }
    console.log('Clearing files from ' + path);
    let dir = fs.readdirSync(path);
    if (dir.length === 0) {
      resolve();
    }
    let deletedCount = 0;
    dir.forEach((elem, i) => {
      rimraf(path + elem, () => {
        deletedCount++;
        console.log('deleted: ', path + elem);
        if (deletedCount == dir.length) {
          resolve();
        }
      });
    });
  });
};

module.exports = {
  clearFolder,
};
