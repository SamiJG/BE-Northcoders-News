const fs = require('fs');

// convert a CSV string to JSON
function parseCsvFile(path) {
  return readFile(path).then(CSVstr => {
    const [keyString, ...valueStrings] = CSVstr.split('\n');
    const keys = keyString.replace(/(^"|"$)/g, '').split(/","/);
    return valueStrings.map(valueString => {
      return valueString
        .replace(/(^"|"$)/g, '')
        .split(/","/)
        .reduce((acc, value, i) => {
          acc[keys[i]] = value;
          return acc;
        }, {});
    });
  });
}
function readFile(path) {
  return new Promise(resolve => {
    fs.readFile(__dirname + path, 'utf8', (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
}

module.exports = parseCsvFile;
