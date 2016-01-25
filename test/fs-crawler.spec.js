'use strict';

var path    = require('path');
var devmode = require('devmode');

require('chai').should();

var Crawler = require('../lib/fs-crawler');
var options = {
  root: path.normalize(__dirname + path.sep + '..' + path.sep + 'lib'),
  maxDepth: 0
};


var crawler = new Crawler(options);
crawler.setEncoding('utf8');

crawler.on('data', function (data) {
  console.log('=>'+data+'<=');
});

crawler.on('end', function (data) {
  console.log(data, '\n');
  crawler.restart(2000);
});

crawler.on('close', function (data) {
  console.log('  -- STEAM CLOSED --');
});

crawler.resume();
