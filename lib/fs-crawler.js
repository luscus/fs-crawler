'use strict';

var Readable = require('stream').Readable;
var util     = require('util');
var Context  = require('./tools/context');
var fs       = require('./tools/fs');


util.inherits(Crawler, Readable);

function Crawler (options) {
    var self = this;

    if (!(this instanceof Crawler)) {
        // enforce instantiation
        return new Crawler(options);
    }

    Readable.call(this, options);

    if (typeof options.maxDepth !== 'number') {
        options.maxDepth = 0;
    }

    // private crawler context
    var context          = new Context(options);

    this.restart = function restart (delay) {
        delay = (typeof delay === 'number' ? delay : 1000);

            setTimeout(function delayedRestart () {
                context = new Context(options);

                self._read();
            }, delay);
    };

    this._read = function _read () {

        if (!context.file.hasNext() && context.folder.hasNext()) {

            // all files has been streamed yet,
            // but some directories have not been crawled
            var path = context.folder.next();

            // wait for directory listing to end
            self.pause();

            fs.list(context, path, function dirCrawlHandler () {
                // reactivate crawler
                self.resume();
            });
        }
        if (!context.file.hasNext() && !this._readableState.buffer.length) {
            console.log('- CRAWL END');
            // the end of the directory structure has been reached
            var report = {
                duration: new Date() - new Date(context.crawlSessionTime())
            };

            self.emit('end', report);
        }
        else if (context.file.hasNext()) {
            // emit next file stats
            var stats = context.file.next();

            self.push(JSON.stringify(stats));
        }
    };
}

module.exports = Crawler;
