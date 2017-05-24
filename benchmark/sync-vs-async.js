#!/usr/bin/env node

/* eslint-disable no-await-in-loop, no-return-assign */

const crypto = require('crypto');
const prettyBytes = require('pretty-bytes');
const Table = require('cli-table');
const timeSpan = require('time-span');
const b64 = require('../');

const bytesToBenchmark = [10000, 100000, 1000000, 10000000, 100000000];

const bench = noOfBytes => Promise.resolve().then(async () => {
	const results = {};
	let end;

	console.log(`Generating ${prettyBytes(noOfBytes)} of random binary data...`);
	const randomBytes = crypto.randomBytes(noOfBytes);

	console.log('Encoding sync...');
	end = timeSpan();
	const randomBytesBase64 = randomBytes.toString('base64');
	results.encodeSync = end();

	console.log('Decoding sync...');
	end = timeSpan();
	Buffer.from(randomBytesBase64, 'base64');
	results.decodeSync = end();

	console.log('Encoding async...');
	end = timeSpan();
	await b64(randomBytes);
	results.encodeAsync = end();

	console.log('Decoding async...');
	end = timeSpan();
	await b64(randomBytesBase64);
	results.decodeAsync = end();

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

	for (const noOfBytes of bytesToBenchmark) {
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
