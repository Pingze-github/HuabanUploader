
// import getImgStats from './getImgStats';
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const prettyBytes = require('pretty-bytes');

const imgRegexDefault = /\.(jpg|jpeg|bmp|gif|png)$/;

function isNameImg(name, imgRegex = imgRegexDefault) {
  return imgRegex.test(name);
}

function getDirImgs(dirpath, deep, imgRegex) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, names) => {
      if (err) return reject(err);
      let imgs = [];
      const deeperPromises = [];
      names.forEach(async (filename) => {
        const filepath = path.join(dirpath, filename);
        const stat = fs.statSync(filepath);
        const isFile = stat.isFile();
        const isImg = isNameImg(filename, imgRegex);
        if (isFile && isImg) {
          const img = {
            path: filepath,
            size: prettyBytes(stat.size),
            mtime: stat.mtime.toLocaleString('chinese', { hour12: false }),
            ctime: stat.ctime.toLocaleString('chinese', { hour12: false }),
            ext: filename.match(/\.(.+?)$/)[1],
            choosen: false,
          };
          const dimensions = await sizeOf(filepath);
          img.dimension = '' + dimensions.width + 'x' + dimensions.height;
          img.width = dimensions.width;
          img.height = dimensions.height;
          imgs.push(img);
        }
        if (deep === true && !isFile) deeperPromises.push(getDirImgs(filepath, true));
      });
      if (deep !== true) return resolve(imgs);
      Promise.all(deeperPromises).then((imgsDeepers) => {
        for (const imgsDeeper of imgsDeepers) {
          imgs = imgs.concat(imgsDeeper);
        }
        resolve(imgs);
      });
    });
  });
}

export default getDirImgs;
