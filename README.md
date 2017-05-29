# base64-async

> Non-blocking chunked Base64 encoding

[![Build Status](https://travis-ci.org/lukechilds/base64-async.svg?branch=master)](https://travis-ci.org/lukechilds/base64-async)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/base64-async/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/base64-async?branch=master)
[![npm](https://img.shields.io/npm/v/base64-async.svg)](https://www.npmjs.com/package/base64-async)

Process large Base64 documents without blocking the event loop.

Configurable chunk size option to optimise for your use case.

> **Note:**
>
> Base64 in Node.js is already crazy fast. Breaking the work up into chunks and adding async logic adds overhead. If you aren't dealing with large files it will probably be more performant to just block the event loop for the small amount of time it takes Node.js to process Base64 synchronously.

## Install

```shell
npm install --save base64-async
```

## Usage

```js
const b64 = require('base64-async');
const fs = require('fs');
const buffer = fs.readFileSync('somehugefile.jpg');

b64.encode(fileBuffer).then(b64String => console.log(b64String));
// aGkgbXVt...

b64.decode(b64String).then(buffer => console.log(buffer));
// <Buffer 68 69 20 6d 75 6d ... >

// or, for the cool kids
const b64String = await b64.encode(fileBuffer);
const originalFileBuffer = await b64.decode(b64String);

// which is equivalent to this
const b64String = await b64(fileBuffer);
const originalFileBuffer = await b64(b64String);
// If no method is specified, buffers are encoded, strings are decoded
```

## Example

```
$ npm run example

Registering 4 asynchronous jobs...
Encoding 100 MB with default Node.js Buffer API...
Base64 encode complete
Hi, I'm an asynchronous job, and I'm late by 231ms
Hi, I'm an asynchronous job, and I'm late by 238ms
Hi, I'm an asynchronous job, and I'm late by 239ms
Hi, I'm an asynchronous job, and I'm late by 245ms

Registering 4 asynchronous jobs...
Encoding 100 MB with base64-async in chunks of 250 kB...
Hi, I'm an asynchronous job, and I'm on time
Hi, I'm an asynchronous job, and I'm on time
Hi, I'm an asynchronous job, and I'm on time
Hi, I'm an asynchronous job, and I'm on time
Base64 encode complete
```

Notice how none of the async jobs can start until the Buffer API has finished encoding and stops blocking the event loop? With `base64-async` the async jobs can execute in-between each chunk of data.

## License

MIT © Luke Childs
