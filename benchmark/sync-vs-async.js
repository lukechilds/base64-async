#!/usr/bin/env node

/* eslint-disable no-await-in-loop, no-return-assign */

const crypto = require('crypto');
const prettyBytes = require('pretty-bytes');
const Table = require('cli-table');
const b64 = require('../');
const ora = require('ora');

const spinner = ora().start();

const bytesToBenchmark = [10000, 100000, 1000000, 10000000];

const timer = {
	reset: () => timer.startTime = process.hrtime(),
	duration: () => process.hrtime(timer.startTime)[1] / 1000000
};

const bench = noOfBytes => Promise.resolve().then(async () => {
	const results = {};

	const humanBytes = prettyBytes(noOfBytes);

	spinner.text = `Generating ${humanBytes} of random binary data...`;
	const randomBytes = crypto.randomBytes(noOfBytes);

	spinner.text = `Encoding ${humanBytes} sync`;
	timer.reset();
	const randomBytesBase64 = randomBytes.toString('base64');
	results.encodeSync = timer.duration();

	spinner.text = `Decoding ${humanBytes} sync`;
	timer.reset();
	Buffer.from(randomBytesBase64, 'base64');
	results.decodeSync = timer.duration();

	spinner.text = `Encoding ${humanBytes} async`;
	timer.reset();
	await b64(randomBytes);
	results.encodeAsync = timer.duration();

	spinner.text = `Decoding ${humanBytes} async`;
	timer.reset();
	await b64(randomBytesBase64);
	results.decodeAsync = timer.duration();

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

	spinner.stop();
	console.log(table.toString());
})();
