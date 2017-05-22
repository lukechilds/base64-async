import test from 'ava';
import b64 from '../';
import values from './fixtures/values';

test('b64.decode returns a Promise', t => {
	const returnValue = b64.decode(values.string);
	t.true(returnValue instanceof Promise);
});

test('b64.decode decodes Base64 to buffer', async t => {
	const result = await b64.decode(values.base64);
	t.true(result instanceof Buffer);
	t.is(result.toString(), values.string);
});

test('b64.decode decodes correctly in chunks', async t => {
	const result = await b64.decode(values.base64, { chunkSize: 4 });
	t.true(result instanceof Buffer);
	t.is(result.toString(), values.string);
});

test('b64.decode rounds chunks up to multiples of 4', async t => {
	const result = await b64.decode(values.base64, { chunkSize: 2 });
	t.true(result instanceof Buffer);
	t.is(result.toString(), values.string);
});

test('b64.decode rejects Promise if chunkSize is 0', async t => {
	await t.throws(b64.decode(values.string, { chunkSize: 0 }));
});

test('b64.decode rejects Promise if input is not a string', async t => {
	await t.throws(b64.decode(values.buffer));
});
