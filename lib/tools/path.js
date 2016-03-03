'use strict';

var path = require('path');

exports.splitIntoDepths = function splitIntoDepths (absolutePath, maxDepth, reverse) {
  var folders = absolutePath.substring(1).split(/\/|\\/g);
  var depths  = [];
  var current = '';

  while (folders.length && (maxDepth ? depths.length <= maxDepth : true)) {
    if (reverse) {
      current = path.sep + folders.join(path.sep);
      folders.pop();
    }
    else {
      current += path.sep + folders.shift();
    }

    depths.push([current]);
  }

  return depths;
};
