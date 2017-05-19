'use strict';

const applyDefaultOpts = opts => Object.assign({}, {
	encoding: 'utf8',
	chunkSize: 10000
}, opts);

const b64 = () => {

};

b64.encode = (input, opts) => new Promise(resolve => {
	opts = applyDefaultOpts(opts);

	if (!(input instanceof Buffer)) {
		input = Buffer.from(input, opts.encoding);
	}

	const chunkMultiple = 3;
	opts.chunkSize = Math.ceil(opts.chunkSize / chunkMultiple) * chunkMultiple;

	if (opts.chunkSize === 0) {
		throw new Error('chunkSize must be larger than 0');
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

module.exports = b64;
