
const exec = require('child_process').exec;

const exePath = require('path').resolve(__dirname, '../../../tool/imageStats/imageStats.exe');

function getImgStats(imgPath) {
  return new Promise((resolve, reject) => {
    exec(`${exePath} ${imgPath}`, (err, stdout) => {
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

export default getImgStats;

