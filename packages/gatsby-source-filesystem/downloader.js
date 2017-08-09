"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require("request");
var path = require("path");
var fs = require("fs");

var onError = function onError(err, done) {
  if (done) {
    return done(err);
  }
  throw err;
};

var downloader = function downloader(_ref) {
  var url = _ref.url,
      dest = _ref.dest,
      auth = _ref.auth,
      done = _ref.done;

  if (!url) {
    throw new Error("The option url is required");
  }

  if (!dest) {
    throw new Error("The option dest is required");
  }

  request({
    url: url,
    encoding: null,
    auth: {
      user: auth.user,
      pass: auth.pass,
      sendImmediately: auth.sendImmediately
    }
  }, function (err, res, body) {
    if (err) {
      return onError(err, done);
    }

    if (body && res.statusCode === 200) {
      if (!path.extname(dest)) {
        dest = path.join(dest, path.basename(url));
      }

      fs.writeFile(dest, body, "binary", function (err) {
        if (err) {
          return onError(err, done);
        }
        done && done(false, dest, body);
      });
    } else {
      if (!body) {
        return onError(new Error("File loading error - empty body. URL: " + url), done);
      }
      onError(new Error("File loading error - " + res.statusCode + ". URL: " + url), done);
    }
  });
};

downloader.file = function (_ref2) {
  var url = _ref2.url,
      dest = _ref2.dest,
      auth = _ref2.auth;
  return new _promise2.default(function (resolve, reject) {
    downloader({
      url: url,
      dest: dest,
      auth: auth,
      done: function done(err, dest, body) {
        if (err) {
          return reject(err);
        }
        resolve({ filename: dest, file: body });
      }
    });
  });
};

module.exports = downloader;