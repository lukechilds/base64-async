'use strict';

const validateOpts = (opts, chunkMultiple) => {
	opts = Object.assign({}, { chunkSize: 250000 }, opts);

	opts.chunkSize = Math.ceil(opts.chunkSize / chunkMultiple) * chunkMultiple;

	if (opts.chunkSize === 0) {
		throw new Error('opts.chunkSize must be larger than 0');
	}

	return opts;
};

const b64 = (input, opts) => {
	if (input instanceof Buffer || typeof input === 'string') {
		const method = input instanceof Buffer ? 'encode' : 'decode';
		return b64[method](input, opts);
	}

	return Promise.reject(new TypeError('input must be a buffer or string'));
};

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

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/-_';
	const lookup = Buffer.from(alphabet);
	const maxCharCode = Math.max(...Array.from(lookup));
	const revLookup = Buffer.allocUnsafe(maxCharCode + 1);
	lookup.forEach((v, i) => {
		revLookup[v] = i;
	});
	// Support decoding url safe b64
	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	const stringLength = input.length;
	const placeHolders = input[stringLength - 2] === '=' ? 2 : input[stringLength - 1] === '=' ? 1 : 0;
	const byteLength = (stringLength * 3 / 4) - placeHolders;
	const output = Buffer.allocUnsafe(byteLength);
	const stringLengthFullChunks = placeHolders > 0 ? stringLength - 4 : stringLength;

	var stringIndex = 0;
	var byteIndex = 0;

	setImmediate(function decodeChunk() {
		const chunkEndIndex = Math.min(stringIndex + opts.chunkSize, stringLengthFullChunks);

		while (stringIndex < chunkEndIndex) {
			const tmp = (revLookup[input.charCodeAt(stringIndex)] << 18) | (revLookup[input.charCodeAt(stringIndex + 1)] << 12) | (revLookup[input.charCodeAt(stringIndex + 2)] << 6) | revLookup[input.charCodeAt(stringIndex + 3)];
			output[byteIndex++] = (tmp >> 16) & 0xFF;
			output[byteIndex++] = (tmp >> 8) & 0xFF;
			output[byteIndex++] = tmp & 0xFF;
			stringIndex += 4;
		}

		if (stringIndex === stringLengthFullChunks) {
			if (placeHolders === 2) {
				const tmp = (revLookup[input.charCodeAt(stringIndex)] << 2) | (revLookup[input.charCodeAt(stringIndex + 1)] >> 4);
				output[byteIndex++] = tmp & 0xFF;
			} else if (placeHolders === 1) {
				const tmp = (revLookup[input.charCodeAt(stringIndex)] << 10) | (revLookup[input.charCodeAt(stringIndex + 1)] << 4) | (revLookup[input.charCodeAt(stringIndex + 2)] >> 2);
				output[byteIndex++] = (tmp >> 8) & 0xFF;
				output[byteIndex++] = tmp & 0xFF;
			}
		}

		if (byteIndex < byteLength) {
			setImmediate(decodeChunk);
		} else {
			resolve(output);
		}
	});
});

module.exports = b64;
