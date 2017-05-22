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
