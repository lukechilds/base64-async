#!/usr/bin/env node

const crypto = require('crypto');
const b64 = require('../');
const prettyBytes = require('pretty-bytes');
const Table = require('cli-table');

const bytesToBenchmark = [10000, 100000, 1000000, 10000000];

const timer = {
  reset: () => timer.startTime = process.hrtime(),
  duration: () => process.hrtime(timer.startTime)[1] / 1000000
};

const bench = noOfBytes => Promise.resolve().then(async () => {
  const results = {};

  console.log(`Generating ${prettyBytes(noOfBytes)} of random binary data...`);
  const randomBytes = crypto.randomBytes(noOfBytes);

  console.log('Encoding sync...');
  timer.reset();
  const randomBytesBase64 = randomBytes.toString('base64');
  results.encodeSync = timer.duration();

  console.log('Decoding sync...');
  timer.reset();
  Buffer.from(randomBytesBase64, 'base64');
  results.decodeSync = timer.duration();

  console.log('Encoding async...');
  timer.reset();
  await b64(randomBytes);
  results.encodeAsync = timer.duration();

  console.log('Decoding async...');
  timer.reset();
  await b64(randomBytesBase64);
  results.decodeAsync = timer.duration();

  console.log();
  return results;
});

(async () => {
  const table = new Table({
    head: [
      'Bytes',
      'Encode Sync',
      'Decode Sync',
      'Encode Async',
      'Decode Async'
    ]
  });

  for(noOfBytes of bytesToBenchmark) {
    const results = await bench(noOfBytes);
    table.push([
      prettyBytes(noOfBytes),
      results.encodeSync + 'ms',
      results.decodeSync + 'ms',
      results.encodeAsync + 'ms',
      results.decodeAsync + 'ms'
    ]);
  }

  console.log(table.toString());
})();
