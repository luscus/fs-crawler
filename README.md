# fs-crawler

[![NPM version](https://img.shields.io/npm/v/fs-crawler.svg?style=flat)](https://www.npmjs.com/package/fs-crawler "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/fs-crawler.svg?style=flat)](https://www.npmjs.com/package/fs-crawler "View this project on NPM")
[![NPM license](https://img.shields.io/npm/l/fs-crawler.svg?style=flat)](https://www.npmjs.com/package/fs-crawler "View this project on NPM")
[![flattr](https://img.shields.io/badge/flattr-donate-yellow.svg?style=flat)](http://flattr.com/thing/3817419/luscus-on-GitHub)

![coverage](https://rawgit.com/luscus/fs-crawler/master/reports/coverage.svg)
[![David](https://img.shields.io/david/luscus/fs-crawler.svg?style=flat)](https://david-dm.org/luscus/fs-crawler)
[![David](https://img.shields.io/david/dev/luscus/fs-crawler.svg?style=flat)](https://david-dm.org/luscus/fs-crawler#info=devDependencies)

Crawls the file system and streams the directory/file information.

## Configuration Options

### Common

* `maxDepth` {number}: max number of folder depth to be crawled to
* `noStats` {boolean}: no file statistics will be retrieved - sparing I/O - only absolute path will be returned
* `filters` {string[]|regex[]}: a mixed array of file extension strings or regular expressions applied against every found file path

### ASYNC Mode Specific

* `flushOnEnd` {boolean}: returns all the data at the end of the stream

### Path Mode Specific

* `reverse` {boolean}: path will be traversed from `maxDepth` to `root`

## Usage

### Installation

```bash
npm install fs-crawler --save
```

### Require module

```javascript
var Crawler = require('fs-crawler');

var options  = {
  reverse: true,
  noStats: false,
  filters: ['txt'],
  maxDepth: 4
};


var crawler = new Crawler();

var results = crawler.crawlTreeSync(testRoot, options);
```

-------------------
Copyright (c) 2016 Luscus (luscus.redbeard@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
