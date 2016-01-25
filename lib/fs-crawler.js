'use strict';

var Readable = require('stream').Readable;
var util     = require('util');
var Context  = require('./tools/context');
var fs       = require('./tools/fs');


util.inherits(Crawler, Readable);

function Crawler (options) {
    if (!(this instanceof Crawler))
        return new Crawler(options);

    Readable.call(this, options);

    if (typeof options.maxDepth !== 'number') {
        options.maxDepth = 0;
    }

    var directoryPointer = 0;
    var filepathPointer  = 0;

    // private crawler context
    var context          = Context.get(options);

    this.hasNextDirectory = function hasNextDirectory () {
        return directoryPointer < context.directories.length;
    };

    this.hasNextFilepath = function hasNextFilepath () {
        return filepathPointer < context.filepaths.length;
    };

    var self = this;

    this.restart = function restart (delay) {
        delay = (typeof delay === 'number' ? delay : 1000);

            setTimeout(function delayedRestart () {
                directoryPointer = 0;
                filepathPointer = 0;
                context = Context.get(options);

                self._read();
            }, delay);
    };

    this._read = function _read () {

        if (!this.hasNextFilepath() && this.hasNextDirectory() && (options.maxDepth === 0 || context.depthPointer < options.maxDepth)) {

            // all files has been streamed yet,
            // but some directories have not been crawled
            var path = context.directories[directoryPointer];
            directoryPointer += 1;

            // wait for directory listing to end
            this.pause();

            fs.list(context, path, function dirCrawlHandler () {
                // reactivate crawler
                self.resume();
            });
        }
        if (!this.hasNextFilepath() && !this._readableState.buffer.length) {
            // the end of the directory structure has been reached
            var report = {
                duration: new Date() - new Date(context.crawlTimestamp)
            };

            if (options.flushOnEnd) {
                // add crawled files to report
                report.files = context.filestats;
            }

            this.emit('end', report);
        }
        else {
            // emit next filestats
            var filepath = context.filepaths[filepathPointer];
            var stats    = JSON.stringify(context.filestats[filepath]);
            filepathPointer += 1;

            this.push(stats);
        }
    };
}

module.exports = Crawler;
