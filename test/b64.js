import test from 'ava';
import b64 from '../';
import values from './fixtures/values';

test('b64 calls b64[opts.method]', async t => {
	const encodeResult = await b64(values.buffer, { method: 'encode' });
	const decodeResult = await b64(values.base64, { method: 'decode' });
	t.is(encodeResult, values.base64);
	t.true(decodeResult instanceof Buffer);
	t.is(decodeResult.toString(), values.string);
});
