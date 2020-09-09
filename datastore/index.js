const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error');
      } else {
        callback(null, {id: id, text: text});
      }
    });
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, fileArr) => {
    if (err) {
      throw 'error';
    }
    //for each file readFile
    var files = _.map(fileArr, (file) => {
      var id = file.slice(0, 5);
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      return readFilePromise(filePath).then(data => {
        return {
          id: id,
          text: data.toString()
        };
      });
    });

    Promise.all(files)
      .then(text => callback(null, text), err => callback(err));
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, text) => {
    if (err) {
      throw ('error');
    } else {
      callback(null, {id: id, text: text});
    }
  });
};

exports.update = (id, text, callback) => {

  var filePath = path.join(exports.dataDir, `${id}.txt`);
  const flag = fs.constants.O_WRONLY | fs.constants.O_TRUNC;
  fs.writeFile(filePath, text, (err) => {
    if (err) {
      throw ('error');
    } else {
      callback(null, {id: id, text: text});
    }
  });
};

exports.delete = (id, callback) => {

  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      throw 'error';
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
