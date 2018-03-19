import fs from 'fs';
import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import getDirImgs from './lib/getDirImgs';
// import StaticServer from './lib/staticServer';

process.on('unhandledRejection', (rej) => {
  console.warn(rej);
});

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

// let staticServer;

// function createStaticServer() {
//   staticServer = new StaticServer();
//   staticServer.start();
// }

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  // mainWindow.setMenu(null);

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // createStaticServer();
}

app.on('ready', createWindow);

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
      event.sender.send('imgs', {
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
