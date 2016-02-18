'use strict';

exports.get = function get (options) {
    return {
        options:        options,
        crawlTimestamp: new Date().toISOString(),
        directories:    [options.root],
        depths:        [[options.root]],
        branchIndex:    0,
        depthPointer:   0,
        filepaths:      [],
        filestats:      {}
    };
};
