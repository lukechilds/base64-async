# base64-async

> Non-blocking chunked base64 encoding

[![Build Status](https://travis-ci.org/lukechilds/base64-async.svg?branch=master)](https://travis-ci.org/lukechilds/base64-async)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/base64-async/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/base64-async?branch=master)
[![npm](https://img.shields.io/npm/v/base64-async.svg)](https://www.npmjs.com/package/base64-async)

## Install

```shell
npm install --save base64-async
```

## Usage

```js
const b64 = require('base64-async');
const fs = require('fs');
const fileBuffer = fs.readFileSync('somehugefile.jpg');

console.log(fileBuffer);
// <Buffer 68 69 20 6d 75 6d ... >

b64.encode(fileBuffer)
  .then(b64String => {
      console.log(b64String);
      // aGkgbXVt...

      return b64.decode(b64String);
  })
  .then(originalFileBuffer => {
    console.log(originalFileBuffer);
    // <Buffer 68 69 20 6d 75 6d ... >
  });

// or, for the cool kids

const b64String = await b64.encode(fileBuffer);
const originalFileBuffer = await b64.decode(b64String);

// which is equivalent to this

const b64String = await b64(fileBuffer);
const originalFileBuffer = await b64(b64String);

// Buffers are encoded, strings are decoded
```

## License

MIT © Luke Childs
