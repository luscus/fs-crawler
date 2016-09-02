'use strict';

var path = require('path');
var fs   = require('fs');

exports.formatStats = function formatStats (absolutePath, rawStats, context) {
  var stats = {
    name:              path.basename(absolutePath),
    path:              absolutePath,
    folderId:          context.folderId(),
    crawlSessionTime:  context.crawlSessionTime()
  };

  if (rawStats) {
    if (rawStats instanceof Error) {
      stats.error = rawStats;
    }
    else {
      if (!context.ignoreStats()) {
        // add the raw file stats
        stats.stats = rawStats;
      }

      stats.is = {
        directory: rawStats.isDirectory(),
        blockDevice: rawStats.isBlockDevice(),
        characterDevice: rawStats.isCharacterDevice(),
        FIFO: rawStats.isFIFO(),
        socket: rawStats.isSocket(),
        link: rawStats.isSymbolicLink()
      };
    }
  }

  return stats;
};

exports.stats = function stats (context, absolutePath, callback) {
  var fileStats = null;
  var stats     = null;

  try {
    stats = fs.lstatSync(absolutePath);
  }
  catch (error) {
    stats = error;
  }

  if (stats.isDirectory && stats.isDirectory() && context.isTreeMode()) {
    // directories found on the actual depth
    // are part of the next depth's directories
    context.folder.add(absolutePath);
  }

  fileStats = exports.formatStats(absolutePath, stats, context);

  if (fileStats.is.link) {
    var info = exports.getSymlinkInfo(absolutePath);

    fileStats.targetPath = info.target;
    fileStats.targetStats = info.stats || null;
  }

  return fileStats;
};

exports.list = function list (context, dirpath, callback) {
  var files    = fs.readdirSync(dirpath);
  var content = {};

  files.forEach(function folderIterator (name) {
    var absolutePath = dirpath + path.sep + name;

    if (exports.filter(context.filters(), absolutePath)) {
      var fileStats = exports.stats(context, absolutePath);

      context.file.add(fileStats);

      content[absolutePath] = fileStats;
    }
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

exports.filter = function filter (filters, absolutePath) {
  var valid = false;

  if (filters.length) {
    var index = filters.length;

    while (index--) {
      var currentFilter = filters[index];

      if (typeof currentFilter === 'string') {
        // converting file extension string to a regular expression
        currentFilter = new RegExp('\.*\\.' + currentFilter + '$');
      }

      valid = currentFilter.test(absolutePath);

      if (valid) {
        // one filter is valid: no need to continue checking
        break;
      }
    }
  }
  else {
    // no filters defined: everything is valid
    valid = true;
  }

  return valid;
};
