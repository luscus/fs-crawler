'use strict';

exports.CRAWL_TREE_MODE         = 'TREE_MODE';
exports.CRAWL_PATH_MODE         = 'PATH_MODE';
exports.TRANSMISSION_ASYNC_MODE = 'ASYNC_MODE';
exports.TRANSMISSION_SYNC_MODE  = 'SYNC_MODE';

exports.validate = function validate (options) {
    options = options || {};

    if (!options.maxDepth || typeof options.maxDepth !== 'number') {
        // no max depth per default
        options.maxDepth = 0;
    }

    if (!options.noStats || typeof options.noStats !== 'boolean') {
        // crawler returns file statistics per default
        options.noStats = false;
    }

    return options;
};

exports.validateTreeOptions = function validateTreeOptions (options) {
    options      = exports.validate(options);
    return options;
};
