
const request = require('./request');

const ua = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36';

module.exports = async function (cookie) {
  const res = await request({
    url: 'http://huaban.com/',
    headers: {
      Cookie: cookie,
      'User-Agent': ua,
    },
  });
  const appReq = pickObj(res.body, 'req');
  const urlName = appReq.user.urlname;

  const resSelf = await request({
    url: `http://huaban.com/${urlName}`,
    headers: {
      Cookie: cookie,
      'User-Agent': ua,
    },
  });
  const pageUser = pickObj(resSelf.body, 'user', 'app.page');
  return {
    sid: appReq.sid,
    user: Object.assign(appReq.user, pageUser),
  };
};

function pickObj(body, key, objName = 'app') {
  const regexp = new RegExp(`${objName}\\["${key}"\\]\\s{0,1}=\\s{0,1}(.+?);\\n`);
  const matches = body.match(regexp);
  if (!matches) {
    console.error('获取用户信息项失败', key);
    return false;
  }
  const match = matches[1];
  if (/^[{\[]/.test(match)) {
    eval(`var obj = ${match}`);
    return obj;
  }
  return match;
}
