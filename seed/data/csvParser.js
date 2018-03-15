const fs = require('fs');

// convert a CSV string to JSON
function parseCsvFile(path) {
  return readFile(path).then(CSVstr => {
    const json = [];
    let data = CSVstr.replace(/"/g, '')
      .split('\n')
      .map(arr => arr.split(','));
    const keys = data.shift();

    for (let i = 0; i < data.length; i++) {
      const object = data[i].reduce((acc, item, i, arr) => {
        acc[keys[i]] = item;
        return acc;
      }, {});
      json.push(object);
    }
    return json;
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
