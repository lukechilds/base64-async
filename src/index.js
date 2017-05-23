'use strict';

const validateOpts = (opts, chunkMultiple) => {
	opts = Object.assign({}, { chunkSize: 10000 }, opts);

	opts.chunkSize = Math.ceil(opts.chunkSize / chunkMultiple) * chunkMultiple;

	if (opts.chunkSize === 0) {
		throw new Error('chunkSize must be larger than 0');
	}

	return opts;
};

const b64 = (input, opts) => b64[opts.method](input, opts);

b64.encode = (input, opts) => new Promise(resolve => {
	const chunkMultiple = 3;
	opts = validateOpts(opts, chunkMultiple);

	if (!(input instanceof Buffer)) {
		throw new TypeError('input must be a buffer');
	}

	const bufferLength = input.length;
	let currentIndex = 0;
	let output = '';

	setImmediate(function encodeChunk() {
		const chunk = input.slice(currentIndex, currentIndex + opts.chunkSize);
		output += chunk.toString('base64');
		currentIndex += opts.chunkSize;
		if (currentIndex < bufferLength) {
			setImmediate(encodeChunk);
		} else {
			resolve(output);
		}
	});
});

b64.decode = (input, opts) => new Promise(resolve => {
	const chunkMultiple = 4;
	opts = validateOpts(opts, chunkMultiple);

	if (typeof input !== 'string') {
		throw new TypeError('input must be a base64 string');
	}

	const stringLength = input.length;
	let currentIndex = 0;
	let output = Buffer.alloc(0);

	setImmediate(function encodeChunk() {
		const chunk = input.slice(currentIndex, currentIndex + opts.chunkSize);
		output = Buffer.concat([output, Buffer.from(chunk, 'base64')]);
		currentIndex += opts.chunkSize;
		if (currentIndex < stringLength) {
			setImmediate(encodeChunk);
		} else {
			resolve(output);
		}
	});
});

module.exports = b64;
