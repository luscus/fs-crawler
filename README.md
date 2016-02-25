# fs-crawler

[![NPM version](https://img.shields.io/npm/v/fs-crawler.svg?style=flat)](https://www.npmjs.com/package/fs-crawler "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/fs-crawler.svg?style=flat)](https://www.npmjs.com/package/fs-crawler "View this project on NPM")
[![NPM license](https://img.shields.io/npm/l/fs-crawler.svg?style=flat)](https://www.npmjs.com/package/fs-crawler "View this project on NPM")
[![flattr](https://img.shields.io/badge/flattr-donate-yellow.svg?style=flat)](http://flattr.com/thing/3817419/luscus-on-GitHub)

![coverage](https://rawgit.com/luscus/fs-crawler/master/reports/coverage.svg)
[![David](https://img.shields.io/david/luscus/fs-crawler.svg?style=flat)](https://david-dm.org/luscus/fs-crawler)
[![David](https://img.shields.io/david/dev/luscus/fs-crawler.svg?style=flat)](https://david-dm.org/luscus/fs-crawler#info=devDependencies)

Crawls the file system and streams the directory/file information.

## Usage

### Installation

```bash
npm install fs-crawler --save
```

### Require module

```javascript
    var Crawler = require('fs-crawler');
    
    var options = {
      root: '/some/absolut/path/to/directory',
      maxDepth: 0       // max subdirectory depth for crawling, 0 = infinity
    };
    
    var crawler = new Crawler(options);
    crawler.setEncoding('utf8'); // String wanted not Buffer
    
    crawler.on('data', function (data) {
      // information about a file or a directory
      console.log(data);
    });
    
    crawler.on('end', function (data) {
      // returns crawl duration in milliseconds
      console.log(data);
      
      // recrawls the filesystem using the same options
      crawler.restart(2000);
    });
    
    // start streaming
    crawler.resume();
```

## Usage


-------------------
Copyright (c) 2016 Luscus (luscus.redbeard@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
