'use strict';

var Options = require('./tools/options');
var path    = require('./tools/path');
var clone   = require('clone');

function Context (options) {
  var self           = this;

  var crawlTimestamp = new Date().toISOString();
  var depthPointer   = 0;
  var nextDepthIndex = 0;
  var folderPointer  = 0;
  var filePointer    = 0;
  var files          = [];
  var allFiles       = [];

  var depths         = (options.crawlMode === Options.CRAWL_TREE_MODE ?
      [[options.root]] :
      path.splitIntoDepths(options.root, options.maxDepth, options.reverse)
  );

  this.options = function () {
    return clone(options);
  };

  this.filters = function () {
    return options.filters || [];
  };

  this.ignoreStats = function () {
    return (options.noStats === true);
  };

  this.isTreeMode = function () {
    return (options.crawlMode === Options.CRAWL_TREE_MODE);
  };

  this.isSyncMode = function () {
    return (options.transmissionMode === Options.TRANSMISSION_SYNC_MODE);
  };

  this.crawlLimitReached = function () {
    return (options.maxDepth ? nextDepthIndex > options.maxDepth : false);
  };

  this.crawlSessionTime = function () {
    return crawlTimestamp;
  };

  this.folderId = function () {
    return {
      depth: depthPointer,
      index: folderPointer - 1
    };
  };

  this.depth = {
    hasNext: function () {
      return depthPointer < depths.length && !self.crawlLimitReached();
    },
    next: function () {

      if (self.crawlLimitReached()) {
        return null;
      }

      nextDepthIndex = depthPointer + 1;

      if (depths.length === nextDepthIndex) {
        // the next depth array is missing
        // crawling of new depth has started
        // adding it to the collection
        depths.push([]);
      }

      return depths[nextDepthIndex];
    },
    current: function () {
      return depths[depthPointer];
    }
  };

  this.folder = {
    hasNext: function () {
      return (
        (depths[depthPointer] && folderPointer < depths[depthPointer].length) ||
        self.depth.hasNext()
      );
    },
    next: function () {

      if (!self.folder.hasNext()) {
        return null;
      }

      if (folderPointer === depths[depthPointer].length) {
        // end of depth folder array found
        // increment depth pointer
        depthPointer += 1;
        // reset folder pointer
        folderPointer = 0;

        return self.folder.next();
      }

      // reset folder file array
      filePointer   = 0;
      files         = [];

      var folder = depths[depthPointer][folderPointer];
      folderPointer += 1;

      return folder;
    },
    add: function (folderPath) {
      if (self.depth.hasNext()) {
        self.depth.next().push(folderPath);
      }
    }
  };

  this.file = {
    hasNext: function () {
      return filePointer < files.length;
    },
    next: function () {

      if (!self.file.hasNext()) {
        return null;
      }

      var file     = files[filePointer];
      filePointer += 1;

      return file;
    },
    all: function () {
      return allFiles;
    },
    add: function (stats) {
      files.push(stats);

      if (self.isSyncMode() || options.flushOnEnd) {
        allFiles.push(stats);
      }
    }
  };
}

module.exports = Context;
