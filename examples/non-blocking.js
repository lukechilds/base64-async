#!/usr/bin/env node

const prettyBytes = require('pretty-bytes');
const b64 = require('../');

const chunkSize = 250000;
const bytes = 100000000;
const buf = Buffer.alloc(bytes);
const interval = 25;
const asyncStart = Date.now();

let i = 0;
const asyncId = setInterval(() => {
	if (++i >= 4) clearInterval(asyncId);

	const late = Date.now() - (asyncStart + (interval * i));
	console.log(`Hi, I'm an asynchronous job, and I'm ${late > 10 ? `late by ${late}ms` : 'on time'}`);
}, interval);

console.log('Encoding with base64-async');
console.log(`Encoding ${prettyBytes(bytes)} in chunks of ${prettyBytes(chunkSize)}...`);
b64(buf, { chunkSize }).then(() => {
	console.log('Base64 encode complete');
})
