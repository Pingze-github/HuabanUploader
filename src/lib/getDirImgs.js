
const fs = require('fs');
const path = require('path').posix;
const sizeOf = require('image-size');
const readChunk = require('read-chunk');
const getFileType = require('file-type');

const imgRegexDefault = /\.(jpg|jpeg|bmp|gif|png)$/;

function isNameImg(name, imgRegex = imgRegexDefault) {
  return imgRegex.test(name);
}

function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  date = date || new Date();
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (o[k])
        : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

function getDirImgsR(dirpath, deep, imgRegex, baseDirpath) {
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
            relativePath: path.resolve(filepath).replace(path.resolve(baseDirpath), '').replace(/^(\\)|(\/)/, ''),
            size: stat.size,
            mtime: dateFormat(stat.mtime),
            ctime: dateFormat(stat.ctime),
            ext: filename.match(/\.(.+?)$/)[1],
          };
          const fileType = getFileType(readChunk.sync(filepath, 0, 4100));
          img.fileType = fileType ? fileType.mime : '未识别';
          try {
            const dimensions = await sizeOf(filepath);
            img.dimension = '' + dimensions.width + 'x' + dimensions.height;
            img.width = dimensions.width;
            img.height = dimensions.height;
          } catch (e) {
            img.dimension = '未识别';
            img.width = 0;
            img.height = 0;
          }
          imgs.push(img);
        }
        if (deep === true && !isFile) deeperPromises.push(getDirImgsR(filepath, true, imgRegex, baseDirpath));
      });
      if (deep !== true) return resolve(imgs);
      Promise.all(deeperPromises).then((imgsDeepers) => {
        for (const imgsDeeper of imgsDeepers) {
          imgs = imgs.concat(imgsDeeper);
        }
        resolve(imgs);
      }).catch(err => {
        console.warn('[Open dir failed]', err);
      });
    });
  });
}

function getDirImgs(dirpath, deep, imgRegex) {
  return getDirImgsR(dirpath, deep, imgRegex, dirpath);
}

export default getDirImgs;
