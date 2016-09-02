'use strict';

var Readable     = require('stream').Readable;
var util         = require('util');
var Context      = require('./Context');
var Options      = require('./tools/options');
var fs           = require('./tools/fs');


util.inherits(Crawler, Readable);

function Crawler () {
  var self = this;
  var streamEnd = this.end;
  var context;

  if (!(this instanceof Crawler)) {
    // enforce instantiation
    return new Crawler();
  }

  function crawl() {
    var path = context.folder.next();

    if (path) {
      // all files has been streamed yet,
      // but some directories have not been crawled
      fs.list(context, path, function dirCrawlHandler(contentStats) {
        Object.getOwnPropertyNames(contentStats).forEach(function (contentPath) {
          var stats = contentStats[contentPath];
          self.push(JSON.stringify(stats));
          //console.log('  -------\n  -- add content stats buffer:', stats.path.replace(context.options().root, ''));
          //console.log('  -- this._readableState.buffer length:', self._readableState.buffer.length);
        });
      });

      return true;
    } else {
      // nothing to crawl anymore
      // return EOF
      //console.log('  -------\n  -- issue EOF:');
      return self.push(null);
    }
  }

  /*
  TODO emit a custom "end" event
  Readable.end = function end() {
    streamEnd();
    var report = {
      duration: new Date() - new Date(context.crawlSessionTime())
    };

    if (context.file.all().length) {
      report.data = context.file.all();
    }

    console.log('EMIT END EVENT');
    self.emit('end', report);
  };
  */

  this._read = function _read () {
    var status = crawl();
    //console.log('  -- crawl status:', status);

    if (!status) {
      var report = {
        duration: new Date() - new Date(context.crawlSessionTime())
      };

      if (context.file.all().length) {
        report.data = context.file.all();
      }

      //console.log('  -- stream ended:');
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

    //self._read();
    //self.resume();

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

  Readable.call(this);
}

module.exports = Crawler;
