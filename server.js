const server = require('http').createServer();
const fs = require('fs');
const path = require('path');
const urlConvert = require('./urlConverter.js');
const fileserv = require('./fileserv.js');

let baseDir = __dirname;
if (process.argv[2] !== undefined) {
  baseDir = process.argv[2];
}


const return404 = (url, res) => {
  res.writeHead(404, { 'content-type': 'text/html' });
  fs.readFile(path.join(__dirname, '/views/404.html'), (err, data) => {
    if (err) return return404(res.url, res);
    res.end(data);
    return 0;
  });
};

server.on('request', (req, res) => {
  console.log(req.url);
  switch (req.url) {
    case '/help':
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.readFile(path.join(__dirname, '/views/index.html'), (err, data) => {
        if (err) return return404(req.url, res);
        res.end(data);
        return 0;
      });
      return;
    case '/favicon.ico':
      res.writeHead(200);
      res.end();
      return;
    default: {
      const filePath = (req.url !== '/') ? urlConvert(req.url, baseDir) : baseDir;
      const servContent = fileserv(filePath);
      if (servContent.statusCode === 404) { return404(req.url, res); return; }
      res.writeHead(servContent.statusCode, { 'content-type': servContent.contentType });
      if (servContent.body.pipe) {
        servContent.body.pipe(res);
      } else {
        res.end(JSON.stringify(servContent.body));
      }
      break;
    }
  }
});


server.listen(8000);
console.info('Server is listening on http://localhost:8000');
console.info(process.argv[2]);
