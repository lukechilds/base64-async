#!/usr/bin/env node

const prettyBytes = require('pretty-bytes');
const b64 = require('../');

const chunkSize = 250000;
const bytes = 100000000;
const buf = Buffer.alloc(bytes);
const interval = 25;
const asyncStart = Date.now();
const asyncJobs = 4;

console.log(`Registering ${asyncJobs} asynchronous jobs...`);
let i = 0;
const asyncId = setInterval(() => {
	if (++i >= asyncJobs) {
		clearInterval(asyncId);
	}

	const late = Date.now() - (asyncStart + (interval * i));
	console.log(`Hi, I'm an asynchronous job, and I'm ${late > 10 ? `late by ${late}ms` : 'on time'}`);
}, interval);

console.log(`Encoding ${prettyBytes(bytes)} with base64-async in chunks of ${prettyBytes(chunkSize)}...`);
b64(buf, { chunkSize }).then(() => {
	console.log('Base64 encode complete');
});
