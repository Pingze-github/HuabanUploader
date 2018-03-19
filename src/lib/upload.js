// 上传单张图片

const File = require('./file');
const request = require('./request');

module.exports = {
  uploadImg,
};

async function uploadImg(url, filepath, cookie) {
  const res = await request({
    method: 'POST',
    body: {
      upload1: new File(filepath),
    },
    url,
    headers: {
      'Content-Type': 'multipart/form-data',
      Cookie: cookie,
    },
  });
  console.log(res.body);
}
