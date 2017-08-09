"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var md5File = require("md5-file");
var slash = require("slash");
var fs = require("fs");
var mime = require("mime");
var prettyBytes = require("pretty-bytes");
var path = require("path");

var createId = function createId(path) {
  var slashed = slash(path);
  return slashed + " absPath of file";
};

function readFile(file, pluginOptions, cb) {
  var slashed = slash(file);
  var slashedFile = (0, _extends3.default)({}, path.parse(slashed), {
    absolutePath: slashed
  });
  md5File(slashedFile.absolutePath, function (md5Err, contentDigest) {
    fs.stat(slashedFile.absolutePath, function (statErr, stats) {
      // Stringify date objects.
      var newFile = JSON.parse((0, _stringify2.default)((0, _extends3.default)({
        // Don't actually make the File id the absolute path as otherwise
        // people will use the id for that and ids shouldn't be treated as
        // useful information.
        id: createId(file),
        children: [],
        parent: "___SOURCE___",
        internal: {
          contentDigest: contentDigest,
          mediaType: mime.lookup(slashedFile.ext),
          type: "File"
        },
        sourceInstanceName: pluginOptions.name,
        absolutePath: slashedFile.absolutePath,
        relativePath: slash(path.relative(pluginOptions.path, slashedFile.absolutePath)),
        extension: slashedFile.ext.slice(1).toLowerCase(),
        size: stats.size,
        prettySize: prettyBytes(stats.size),
        modifiedTime: stats.mtime,
        accessTime: stats.atime,
        changeTime: stats.ctime,
        birthTime: stats.birthtime
      }, slashedFile, stats)));
      cb(null, newFile);
    });
  });
}

exports.readFile = readFile;

exports.createId = createId;