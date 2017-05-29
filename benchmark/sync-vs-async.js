#!/usr/bin/env node

/* eslint-disable no-await-in-loop */

const crypto = require('crypto');
const prettyBytes = require('pretty-bytes');
const Table = require('cli-table');
const timeSpan = require('time-span');
const b64 = require('../');

const argv = require('minimist')(process.argv.slice(2));

const chunkSize = argv.chunkSize || 250000;
const bytesToBenchmark = (
	argv.bytesToBenchmark
	&& argv.bytesToBenchmark.split(',').map(Number)
) || [10000, 100000, 1000000, 10000000, 100000000];

const log = text => {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(text);
};

const bench = noOfBytes => Promise.resolve().then(async () => {
	const results = {};
	const humanBytes = prettyBytes(noOfBytes);
	let end;

	log(`${humanBytes}: Generating random binary data...`);
	const randomBytes = crypto.randomBytes(noOfBytes);

	log(`${humanBytes}: Encoding sync...`);
	end = timeSpan();
	const randomBytesBase64 = randomBytes.toString('base64');
	results.encodeSync = end();

	log(`${humanBytes}: Decoding sync...`);
	end = timeSpan();
	Buffer.from(randomBytesBase64, 'base64');
	results.decodeSync = end();

	log(`${humanBytes}: Encoding async...`);
	end = timeSpan();
	await b64(randomBytes, { chunkSize });
	results.encodeAsync = end();

	log(`${humanBytes}: Decoding async...`);
	end = timeSpan();
	await b64(randomBytesBase64, { chunkSize });
	results.decodeAsync = end();

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

	log(`Benchmark completed with a chunk size of ${prettyBytes(chunkSize)}\n`);
	console.log(table.toString());
})();
