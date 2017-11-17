const path = require('path');


const convert = (url, baseDir) => {
  const reqPath = url.split('/');
  let filePath = '';
  let fileName = '';
  if (reqPath.length > 1) {
    fileName = reqPath[reqPath.length - 1];
    filePath = path.join(baseDir, reqPath.slice(0, reqPath.length - 1).join('/'));
  } else {
    fileName = reqPath[0];
    filePath = path.join(baseDir);
  }
  return path.join(filePath, fileName);
};


module.exports = convert;
