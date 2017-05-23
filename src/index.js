'use strict';

const b64 = (input, opts) => {
	if (input instanceof Buffer || typeof input === 'string') {
		const method = input instanceof Buffer ? 'encode' : 'decode';
		return b64[method](input, opts);
	}

	return Promise.reject(new TypeError('input must be a buffer or string'));
};

const createCodec = codecOpts => (input, opts) => new Promise(resolve => {
	const { chunkMultiple, inputTypeCheck, initialOutput, updateOutput } = codecOpts;

	opts = Object.assign({}, { chunkSize: 10000 }, opts);

	opts.chunkSize = Math.ceil(opts.chunkSize / chunkMultiple) * chunkMultiple;

	if (opts.chunkSize === 0) {
		throw new Error('opts.chunkSize must be larger than 0');
	}

	inputTypeCheck(input);

	const bufferLength = input.length;
	let currentIndex = 0;
	let output = initialOutput;

	setImmediate(function encodeChunk() {
		const chunk = input.slice(currentIndex, currentIndex + opts.chunkSize);
		output = updateOutput(output, chunk);
		currentIndex += opts.chunkSize;
		if (currentIndex < bufferLength) {
			setImmediate(encodeChunk);
		} else {
			resolve(output);
		}
	});
});

b64.encode = createCodec({
	chunkMultiple: 3,
	inputTypeCheck: input => {
		if (!(input instanceof Buffer)) {
			throw new TypeError('input must be a buffer');
		}
	},
	initialOutput: '',
	updateOutput: (output, chunk) => {
		output += chunk.toString('base64');
		return output;
	}
});

b64.decode = createCodec({
	chunkMultiple: 4,
	inputTypeCheck: input => {
		if (typeof input !== 'string') {
			throw new TypeError('input must be a base64 string');
		}
	},
	initialOutput: Buffer.alloc(0),
	updateOutput: (output, chunk) => Buffer.concat([output, Buffer.from(chunk, 'base64')])
});

module.exports = b64;
