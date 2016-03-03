'use strict';

var path     = require('path');
var Crawler  = require('../lib/fs-crawler');
var testRoot = path.normalize(__dirname + path.sep + 'fs');
var options  = {
  flushOnEnd: true,
  reverse:    true,
  noStats:    true,
  maxDepth:   4
};


var crawler = new Crawler();
crawler.crawlTree(testRoot, options);

crawler.setEncoding('utf8');

crawler.on('data', function (data) {
  data = JSON.parse(data);

  console.log('TREE ASYNC:', data.folderId, '=>', data.path);
});

crawler.on('readable', function () {
  console.log('STREAM-READABLE', arguments);
});

crawler.on('end', function (data) {
  console.log('STREAM-END', arguments);
});

crawler.on('error', function (data) {
  console.log('STREAM-ERROR', arguments);
});

crawler.on('close', function (data) {
  console.log('  -- STEAM CLOSED --');
});

//##########################################################
/*
var crawlerPath = new Crawler();
crawlerPath.crawlPath('/media/nysos/Nysos-EXT/dev/fs-crawler/test/fs/long/deep/path/to/files', options);

crawlerPath.setEncoding('utf8');

crawlerPath.on('data', function (data) {
  data = JSON.parse(data);

  console.log('PATH ASYNC:', data.folderId, '=>', data.path);
});

crawlerPath.on('readable', function () {
  console.log('STREAM-READABLE', arguments);
});

crawlerPath.on('end', function (data) {
  console.log('STREAM-END', arguments);
});

crawlerPath.on('error', function (data) {
  console.log('STREAM-ERROR', data);
});

crawlerPath.on('close', function (data) {
  console.log('  -- STEAM CLOSED --');
});


process.on('uncaughtException', function (er) {
  console.error('EXCEPTION', er.stack);
});
*/
