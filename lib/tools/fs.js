'use strict';

var path = require('path');
var fs   = require('fs');

exports.stats = function stats (context, absolutePath, callback) {
    var stats = fs.lstatSync(absolutePath);
    var name  = path.basename(absolutePath);

    if (stats.isDirectory()) {
      // directories found on the actual depth
      // are part of the next depth's directories
      context.folder.add(absolutePath);
    }

    var fileStats = {
      name:              name,
      path:              absolutePath,
      folderId:          context.folderId(),
      crawlSessionTime:  context.crawlSessionTime(),
      stats:             stats,
      is: {
        directory:       stats.isDirectory(),
        blockDevice:     stats.isBlockDevice(),
        characterDevice: stats.isCharacterDevice(),
        FIFO:            stats.isFIFO(),
        socket:          stats.isSocket(),
        link:            stats.isSymbolicLink()
      }
    };

    if (fileStats.is.link) {
      var info = exports.getSymlinkInfo(absolutePath);

      fileStats.targetPath  = info.target;
      fileStats.targetStats = info.stats || null;
    }

  return fileStats;
};

exports.list = function list (context, dirpath, callback) {
  var files    = fs.readdirSync(dirpath);
  var content = {};

  files.forEach(function folderIterator (name) {
    var absolutePath = dirpath + path.sep + name;
    var fileStats    = exports.stats(context, absolutePath);

    context.file.add(fileStats);

    content[absolutePath] = fileStats;
  });

  // package folder names as Array
  callback(content);
};

exports.getSymlinkInfo = function getSymlinkInfo (linkpath) {
  var targetpath  = fs.readlinkSync(linkpath);
  var info        = {
    target: targetpath
  };

  try {
    info.stats    = fs.lstatSync(targetpath);
  }
  catch (linkException) {
    if (linkException.code !== 'ENOENT') {
      throw linkException;
    }
  }

  return info;
};
