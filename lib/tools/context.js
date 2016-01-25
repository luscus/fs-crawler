'use strict';

exports.get = function get (options) {
    return {
        crawlTimestamp: new Date().toISOString(),
        directories: [options.root],
        depths:      [[options.root]],
        depthPointer: 0,
        filepaths:   [],
        filestats:   {}
    };
};
