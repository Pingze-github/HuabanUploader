
const fs = require('fs');

const request = require('./request');

const authUrl = 'https://huaban.com/auth/';

const cachePath = './cookie-cache';

const ua = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36';

module.exports = async function (account, password) {
  const cacheObj = readCache();
  const cookie = cacheObj[account];
  if (cookie && await checkCookie(cookie)) {
    return {
      succeed: true,
      cookie,
      ext: 'cache',
    };
  }
  const res = await request({
    method: 'POST',
    url: authUrl,
    body: {
      email: account,
      password,
      _ref: 'loginPage',
    },
    headers: {
      'User-Agent': ua,
      Referer: 'https://huaban.com/login/',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Request': 'JSON',
    },
  });
  console.log(res.body);
  if (res.body.includes('user_id')) {
    const cookie = res.headers['set-cookie'].join(';');
    writeCache(cacheObj, account, cookie);
    return {
      succeed: true,
      cookie,
      ext: 'login',
    };
  } else if (res.body.includes('登录频率过快')) {
    return {
      succeed: false,
      ext: 'login-freq-too-high',
    };
  } else if (res.body.includes('用户不存在')) {
    return {
      succeed: false,
      ext: 'invalid-account',
    };
  } else if (res.body.includes('用户密码错误')) {
    return {
      succeed: false,
      ext: 'wrong-password',
    };
  }
  return {
    succeed: false,
    ext: 'unknown',
  };
};

function readCache() {
  let cacheObj;
  try {
    const text = fs.readFileSync(cachePath, 'utf-8');
    cacheObj = JSON.parse(text);
  } catch (err) {
    return {};
  }
  return cacheObj;
}

function writeCache(cacheObj, account, cookie) {
  cacheObj[account] = cookie;
  try {
    fs.writeFileSync(cachePath, JSON.stringify(cacheObj));
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
}

async function checkCookie(cookie) {
  const res = await request({
    url: 'http://huaban.com/',
    headers: {
      Cookie: cookie,
      'User-Agent': ua,
    },
  });
  return /"user_id":\d+/.test(res.body);
}
