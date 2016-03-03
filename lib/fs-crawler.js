'use strict';

var Readable     = require('stream').Readable;
var util         = require('util');
var Context      = require('./Context');
var Options      = require('./tools/options');
var fs           = require('./tools/fs');


util.inherits(Crawler, Readable);

function Crawler () {
  var self = this;
  var context;

  if (!(this instanceof Crawler)) {
    // enforce instantiation
    return new Crawler();
  }

  Readable.call(this);

  this._read = function _read () {

    if (!context.file.hasNext() && context.folder.hasNext()) {

      // all files has been streamed yet,
      // but some directories have not been crawled
      var path = context.folder.next();

      if (path) {
        // wait for directory listing to end
        self.pause();

        fs.list(context, path, function dirCrawlHandler() {
          // reactivate crawler
          self.resume();
        });
      }
    }
    if (!context.file.hasNext() && !this._readableState.buffer.length) {
      console.log('- CRAWL END');
      // the end of the directory structure has been reached
      var report = {
        duration: new Date() - new Date(context.crawlSessionTime())
      };

      if (context.file.all().length) {
        report.data = context.file.all();
      }

      self.emit('end', report);
    }
    else if (context.file.hasNext()) {
      // emit next file stats
      var stats = context.file.next();

      self.push(JSON.stringify(stats));
    }
  };

  this._readSync = function _readSync () {

    while (context.folder.hasNext()) {
      // all files has been streamed yet,
      // but some directories have not been crawled
      var path = context.folder.next();

      if (path) {
        fs.list(context, path, function dirCrawlHandler() {
          // reactivate crawler
        });
      }
    }

    // emit all files stats
    return context.file.all();
  };

  this.crawlTree = function crawlTree (absolutPath, options) {
    options           = Options.validateTreeOptions(options);
    options.crawlMode = Options.CRAWL_TREE_MODE;
    options.transmissionMode = Options.TRANSMISSION_ASYNC_MODE;
    options.root      = absolutPath;

    context = new Context(options);

    self._read();
    self.resume();

    return self;
  };

  this.crawlTreeSync = function crawlTreeSync (absolutPath, options) {
    options           = Options.validateTreeOptions(options);
    options.crawlMode = Options.CRAWL_TREE_MODE;
    options.transmissionMode = Options.TRANSMISSION_SYNC_MODE;
    options.root      = absolutPath;

    context = new Context(options);

    return self._readSync();
  };

  this.crawlPath = function crawlPath (absolutPath, options) {
    options           = Options.validateTreeOptions(options);
    options.crawlMode = Options.CRAWL_PATH_MODE;
    options.transmissionMode = Options.TRANSMISSION_ASYNC_MODE;
    options.root      = absolutPath;

    context = new Context(options);

    self._read();
    self.resume();

    return self;
  };

  this.crawlPathSync = function crawlPathSync (absolutPath, options) {
    options           = Options.validateTreeOptions(options);
    options.crawlMode = Options.CRAWL_PATH_MODE;
    options.transmissionMode = Options.TRANSMISSION_SYNC_MODE;
    options.root      = absolutPath;

    context = new Context(options);

    return self._readSync();
  };
}

module.exports = Crawler;
