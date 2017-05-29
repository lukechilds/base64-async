#!/usr/bin/env node

/* eslint-disable no-await-in-loop */

const crypto = require('crypto');
const fs = require('fs');
const prettyBytes = require('pretty-bytes');
const pify = require('pify');
const Table = require('cli-table');
const timeSpan = require('time-span');
const got = require('got');
const b64 = require('../');
const createServer = require('./helpers/server');

const chunkSize = 250000;
const reqs = 100;
const payloadSize = 10000000;

const log = text => {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(text);
};

const server = async () => {
	const s = await createServer();

	let syncIndex = 0;
	s.on('/sync', (req, res) => {
		const body = [];
		req.on('data', chunk => body.push(chunk)).on('end', async () => {
			const base64 = Buffer.concat(body).toString('base64');
			await pify(fs.writeFile)(`/tmp/sync-${syncIndex++}.b64`, base64);
			Buffer.from(base64, 'base64');
			res.end(base64);
		});
	});

	let asyncIndex = 0;
	s.on('/async', (req, res) => {
		const body = [];
		req.on('data', chunk => body.push(chunk)).on('end', async () => {
			const base64 = await b64(Buffer.concat(body), { chunkSize });
			await pify(fs.writeFile)(`/tmp/async-${asyncIndex++}.b64`, base64);
			await b64(base64, { chunkSize });
			res.end(base64);
		});
	});

	await s.listen(s.port);

	return s;
};

const bench = async url => {
	log(`Generating ${prettyBytes(payloadSize)} of random binary data for payload...`);
	const randomBytes = crypto.randomBytes(payloadSize);

	log(`Hitting ${url} with ${reqs} requests...`);
	return Promise.all(Array(reqs).fill(0).map(async () => {
		const end = timeSpan();
		await got(url, { body: randomBytes });
		return end();
	}));
};

(async () => {
	const results = {};
	const s = await server();
	for (const endpoint of ['/sync', '/async']) {
		const responseTimes = (await bench(s.url + endpoint)).sort((a, b) => a - b);
		const sum = responseTimes.reduce((a, b) => a + b);
		const min = Math.min(...responseTimes);
		const max = Math.max(...responseTimes);
		const avg = sum / responseTimes.length;
		const median = (responseTimes[(responseTimes.length - 1) >> 1] + responseTimes[responseTimes.length >> 1]) / 2;

		results[endpoint] = {
			Combined: sum,
			Fastest: min,
			Slowest: max,
			Average: avg,
			Median: median
		};
	}
	await s.close();

	const table = new Table({
		head: [
			'Response Time',
			'Sync',
			'Async'
		]
	});

	Object.keys(results['/sync']).forEach(type => table.push([
		type,
		Math.round(results['/sync'][type]) + 'ms',
		Math.round(results['/async'][type]) + 'ms'
	]));

	log(`Benchmark completed ${reqs} reqs with a payload size of ${prettyBytes(payloadSize)} and a chunk size of ${prettyBytes(chunkSize)}\n`);
	console.log(table.toString());
})();
