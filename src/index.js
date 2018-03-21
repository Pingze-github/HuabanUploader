import fs from 'fs';
import path from 'path';
import watch from 'glob-watcher';
import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import getDirImgs from './lib/getDirImgs';

process.on('unhandledRejection', (rej) => {
  console.error('[unhandledRejection]');
  console.error(rej);
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    backgroundColor: '#f5f7f9',
  });

  // mainWindow.setMenu(null);

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

function watchReload() {
  const files = [
    path.join(__dirname, './index.html'),
    path.join(__dirname, './renderer.js'),
    path.join(__dirname, '../static/index.css'),
  ];
  watch(files, (done) => {
    mainWindow.reload();
    done();
  });
}

app.on('ready', () => {
  createWindow();
  watchReload();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('open-dir', (event, dirPath) => {
  fs.stat(dirPath, async (err, stat) => {
    if (err || !stat.isDirectory()) {
      return event.sender.send('imgs', {
        succeed: false,
        msg: '不存在指定路径的文件目录',
      });
    }
    const imgs = await getDirImgs(dirPath, true);
    event.sender.send('imgs', {
      succeed: true,
      data: imgs,
    });
  });
});

// TODO 输入部分切换效果
// TODO 登录和显示用户信息
// TODO 上传功能
// TODO ICON
