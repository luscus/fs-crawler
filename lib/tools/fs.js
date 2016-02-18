'use strict';

var path = require('path');
var fs   = require('fs');

exports.list = function list (context, dirpath, callback) {
  // load actual depth
  var actualDepth     = context.depths[context.depthPointer];
  var nextDepth;

  // each depth has a directory array
  // find the actual directory index
  context.branchIndex = actualDepth.indexOf(dirpath);

  if (context.branchIndex < 0) {
    // directory path is not part of this depth
    // starting crawling of new depth
    context.depthPointer += 1;
    context.branchIndex   = 0;
  }


  var nextDepthIndex   = context.depthPointer + 1;
  var nextDepthAllowed = (context.options.maxDepth === 0 || nextDepthIndex <= context.options.maxDepth);

  if (context.depths.length === nextDepthIndex) {
    // the next depth array is missing
    // adding it to the collection
    nextDepth             = [];
    context.depths.push(nextDepth);
  }
  else {
    // loading the next depth array
    nextDepth = context.depths[nextDepthIndex];
  }

  var folders = fs.readdirSync(dirpath);
  var content = {};

  folders.forEach(function folderIterator (name) {
    var absolutePath = dirpath + path.sep + name;
    var stats = fs.lstatSync(absolutePath);

    if (nextDepthAllowed && stats.isDirectory()) {
      // directories found on the actual depth
      // are part of the next depth's directories
      nextDepth.push(absolutePath);
      context.directories.push(absolutePath);
    }

    context.filepaths.push(absolutePath);
    context.filestats[absolutePath] = {
      name: name,
      path: absolutePath,
      directory: {
        depth:  context.depthPointer,
        index: context.branchIndex
      },
      crawlTimestamp: context.crawlTimestamp,
      stats: stats,
      is: {
        directory:       stats.isDirectory(),
        blockDevice:     stats.isBlockDevice(),
        characterDevice: stats.isCharacterDevice(),
        FIFO:            stats.isFIFO(),
        socket:          stats.isSocket(),
        link:            stats.isSymbolicLink()
      }
    };

    if (context.filestats[absolutePath].is.link) {
      var info = exports.getSymlinkInfo(absolutePath);

      context.filestats[absolutePath].targetPath  = info.target;
      context.filestats[absolutePath].targetStats = info.stats || null;
    }

    content[absolutePath] = context.filestats[absolutePath];
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
