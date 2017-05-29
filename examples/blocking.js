#!/usr/bin/env node

const prettyBytes = require('pretty-bytes');

const bytes = 100000000;
const buf = Buffer.alloc(bytes);
const interval = 25;
const syncStart = Date.now();
const asyncJobs = 4;

console.log(`Registering ${asyncJobs} asynchronous jobs...`);
let i = 0;
const syncId = setInterval(() => {
	if (++i >= asyncJobs) {
		clearInterval(syncId);
	}

	const late = Date.now() - (syncStart + (interval * i));
	console.log(`Hi, I'm an asynchronous job, and I'm ${late > 10 ? `late by ${late}ms` : 'on time'}`);
}, interval);

console.log(`Encoding ${prettyBytes(bytes)} with default Node.js Buffer API...`);
buf.toString('base64');
console.log('Base64 encode complete');
