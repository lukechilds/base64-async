import test from 'ava';
import b64 from '../';
import values from './fixtures/values';

test('b64.encode encodes string to Base64', async t => {
	const result = await b64.encode(values.string);
	t.is(result, values.base64);
});

test('b64.encode encodes buffer to Base64', async t => {
	const result = await b64.encode(values.buffer);
	t.is(result, values.base64);
});

test('b64.encode encodes correctly in chunks', async t => {
	const result = await b64.encode(values.buffer, { chunkSize: 3 });
	t.is(result, values.base64);
});

test('b64.encode rounds chunks up to multiples of 3', async t => {
	const result = await b64.encode(values.buffer, { chunkSize: 1 });
	t.is(result, values.base64);
});
