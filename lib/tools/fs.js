'use strict';

var path = require('path');
var fs   = require('fs');

exports.list = function list (context, dirpath, callback) {
  var depth = context.depths;

  if (context.depths.indexOf(dirpath) < 0) {
    // directory path is not part of this depth
    // starting crawling of new depth
    depth                = [];
    context.depths.push(depth);
    context.depthPointer += 1;
  }

  var folders = fs.readdirSync(dirpath);
  var content = {};

  folders.forEach(function folderIterator (name) {
    var absolutePath = dirpath + path.sep + name;
    var stats = fs.lstatSync(absolutePath);

    if (stats.isDirectory()) {
      depth.push(absolutePath);
      context.directories.push(absolutePath);
    }

    context.filepaths.push(absolutePath);
    context.filestats[absolutePath] = {
      path: absolutePath,
      crawlTimestamp: context.crawlTimestamp,
      stats: stats,
      isDirectory: stats.isDirectory(),
      isBlockDevice: stats.isBlockDevice(),
      isCharacterDevice: stats.isCharacterDevice(),
      isFIFO: stats.isFIFO(),
      isSocket: stats.isSocket(),
      isLink: stats.isSymbolicLink()
    };

    if (context.filestats[absolutePath].isSymbolicLink) {
      var info = exports.getSymlinkInfo(absolutePath);

      context.filestats[absolutePath].links    = info.links;
      context.filestats[absolutePath].isBroken = info.isBroken;
    }

    content[absolutePath] = context.filestats[absolutePath];
  });

  // package folder names as Array
  callback(content);
};

exports.getSymlinkInfo = function getSymlinkInfo (linkpath) {
  var targetpath  = fs.readlinkSync(linkpath);
  var info        = {
    links: targetpath
  };

  try {
    info.stats = fs.lstatSync(linkpath);
    info.isBroken = false;
  }
  catch (linkException) {
    info.isBroken = true;
  }

  return info;
};
