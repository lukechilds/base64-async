'use strict';

const applyDefaultOpts = opts => Object.assign({}, {
	encoding: 'utf8',
	chunks: 1
}, opts);

const b64 = (inut, opts) => {

};

b64.encode = (input, opts) => new Promise(resolve => {
	opts = applyDefaultOpts(opts);

	if (!(input instanceof Buffer)) {
		input = Buffer.from(input, opts.encoding);
	}

	const bufferLength = input.length;
	const chunkSize = 3 * opts.chunks;
	let currentIndex = 0;
	let output = '';

	setImmediate(function encodeChunk() {
		const chunk = input.slice(currentIndex, currentIndex + chunkSize);
		output += chunk.toString('base64');
		currentIndex += chunkSize;
		if (currentIndex < bufferLength) {
			setImmediate(encodeChunk);
		} else {
			resolve(output);
		}
	});
});

module.exports = b64;
