
const fs = require('fs');
const http = require('http');
const path = require('path');

function respondNotFound(req, res) {
  res.writeHead(404, {
    'Content-Type': 'text/html',
  });
  res.end(`<h1>Not Found</h1><p>The requested URL ${req.url} was not found on this server.</p>`);
}

function respondFile(pathName, req, res) {
  const readStream = fs.createReadStream(pathName);
  readStream.pipe(res);
}

function routeHandler(pathName, req, res) {
  fs.stat(pathName, (err) => {
    if (!err) {
      respondFile(pathName, req, res);
    } else {
      respondNotFound(req, res);
    }
  });
}

class StaticServer {
  constructor(root = './', port = 10880) {
    this.port = port;
    this.root = root;
  }

  start() {
    http.createServer((req, res) => {
      const pathName = decodeURI(path.join(this.root, path.normalize(req.url)));
      res.writeHead(200);
      routeHandler(pathName, req, res);
    }).listen(this.port, err => {
      if (err) {
        console.error(err);
        console.info('Failed to start server');
      } else {
        console.info(`Server started on port ${this.port}`);
      }
    });
  }

  setRoot(root) {
    this.root = root;
  }

}

export default StaticServer;
