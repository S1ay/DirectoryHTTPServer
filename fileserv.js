const fs = require('fs');
const path = require('path');

const getFileStream = (filePath) => {
  try {
    if (!filePath) return { statusCode: 404 };

    if (fs.existsSync(path.join(filePath))) {
      if (fs.statSync(filePath).isFile()) {
        let returnContentType = 'text/plain';
        switch (path.extname(filePath)) {
          case '.html':
          case '.htm':
            returnContentType = 'text/html';
            break;
          case '.json':
            returnContentType = 'application/json';
            break;
          case '.xml':
            returnContentType = 'application/xml';
            break;
          default:
            returnContentType = 'text/plain';
            break;
        }
        return {
          body: fs.createReadStream(filePath),
          statusCode: 200,
          contentType: returnContentType,
        };
      }
      return { body: fs.readdirSync(filePath), statusCode: 200, contentType: 'application/json' };
    }

    // file extension completion
    if (fs.existsSync(path.join(`${filePath}.html`))) return { body: fs.createReadStream(`${filePath}.html`), statusCode: 200, contentType: 'text/html' };
    if (fs.existsSync(path.join(`${filePath}.htm`))) return { body: fs.createReadStream(`${filePath}.htm`), statusCode: 200, contentType: 'text/html' };
    if (fs.existsSync(path.join(`${filePath}.json`))) return { body: fs.createReadStream(`${filePath}.json`), statusCode: 200, contentType: 'application/json' };
    const basePath = filePath.substring(0, filePath.replace('\\', '/').lastIndexOf('/'));
    const fileName = filePath.substring(filePath.replace('\\', '/').lastIndexOf('/') + 1);
    console.log('FileName', fileName);
    console.log('BasePath', basePath);
    const files = fs.readdirSync(path.join(basePath));
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].startsWith(fileName)) {
        return { body: fs.createReadStream(path.join(basePath, files[i])), statusCode: 200, contentType: 'text/plain' };
      }
    }
    return { statusCode: 404 };
  } catch (e) {
    return { statusCode: 404 };
  }
};

module.exports = getFileStream;
