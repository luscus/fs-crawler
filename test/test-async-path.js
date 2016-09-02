'use strict';

var path     = require('path');
var Crawler  = require('../lib/fs-crawler');
var testRoot = path.normalize(__dirname + path.sep + 'fs');
var options  = {
  flushOnEnd: true,
  reverse:    true,
  noStats:    false,
  maxDepth:   5
};
var crawlerPath = new Crawler();
crawlerPath.crawlPath(__dirname + '/fs/long/deep/path/to/files', options);

crawlerPath.setEncoding('utf8');

crawlerPath.on('data', function (data) {
  data = JSON.parse(data);

  console.log('STREAM-DATA-PATH:', data.folderId, '=>', data.path.replace(__dirname, ''));
});

crawlerPath.on('readable', function () {
  console.log('STREAM-READABLE', arguments);
});

crawlerPath.on('end', function (data) {
  console.log('STREAM-END');
});

crawlerPath.on('error', function (data) {
  console.log('STREAM-ERROR', data);
});

crawlerPath.on('close', function () {
  console.log('  -- STEAM CLOSED --');
});


process.on('uncaughtException', function (er) {
  console.error('EXCEPTION', er.stack);
});
