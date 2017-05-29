#!/usr/bin/env node

const prettyBytes = require('pretty-bytes');

const chunkSize = 250000;
const bytes = 100000000;
const buf = Buffer.alloc(bytes);
const interval = 25;
const syncStart = Date.now();

let i = 0;
const syncId = setInterval(() => {
	if (++i >= 4) clearInterval(syncId);

	const late = Date.now() - (syncStart + (interval * i));
	console.log(`Hi, I'm an asynchronous job, and I'm ${late > 10 ? `late by ${late}ms` : 'on time'}`);
}, interval);

console.log('Encoding with default Node.js function');
console.log(`Encoding ${prettyBytes(bytes)}...`);
buf.toString('base64');
console.log('Base64 encode complete');
