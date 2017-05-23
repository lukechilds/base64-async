import test from 'ava';
import b64 from '../';
import values from './fixtures/values';

test('b64 is a function', t => {
	t.is(typeof b64, 'function');
});

test('b64 calls b64.encode on buffers', async t => {
	const result = await b64(values.buffer);
	t.is(result, values.base64);
});

test('b64 calls b64.decode on strings', async t => {
	const result = await b64(values.base64);
	t.true(result instanceof Buffer);
	t.is(result.toString(), values.string);
});

test('b64 rejects Promise if input is not a buffer or string', async t => {
	const error = await t.throws(b64(0));
	t.is(error.message, 'input must be a buffer or string');
});
