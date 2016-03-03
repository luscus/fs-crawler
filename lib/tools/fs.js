'use strict';

var path = require('path');
var fs   = require('fs');

exports.formatStats = function formatStats (absolutePath, rawStats, crawlSessionTime, folderId) {
  var stats = {
    name:              path.basename(absolutePath),
    path:              absolutePath,
    folderId:          folderId,
    crawlSessionTime:  crawlSessionTime
  };

  if (rawStats) {
    if (rawStats instanceof Error) {
      stats.error = rawStats;
    }
    else {
      stats.stats = rawStats;
      stats.is = {
        directory: rawStats.isDirectory(),
        blockDevice: rawStats.isBlockDevice(),
        characterDevice: rawStats.isCharacterDevice(),
        FIFO: rawStats.isFIFO(),
        socket: rawStats.isSocket(),
        link: rawStats.isSymbolicLink()
      }
    }
  }

  return stats;
};

exports.stats = function stats (context, absolutePath, callback) {
  var fileStats = null;
  var stats     = null;

  if (!context.ignoreStats()) {
    try {
      stats = fs.lstatSync(absolutePath);

      if (stats.isDirectory() && context.isTreeMode()) {
        // directories found on the actual depth
        // are part of the next depth's directories
        context.folder.add(absolutePath);
      }

      fileStats = exports.formatStats(absolutePath, stats, context.crawlSessionTime(), context.folderId());

      if (fileStats.is.link) {
        var info = exports.getSymlinkInfo(absolutePath);

        fileStats.targetPath = info.target;
        fileStats.targetStats = info.stats || null;
      }
    }
    catch (error) {
      stats = error;
    }
  }

  fileStats = exports.formatStats(absolutePath, stats, context.crawlSessionTime(), context.folderId());

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
