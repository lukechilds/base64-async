import test from 'ava';
import b64 from '../';

test('b64.encode encodes string to Base64', async t => {
	const string = 'This is a test string';
	const expectedB64String = Buffer.from(string).toString('base64');

	const b64String = await b64.encode(string);

	t.is(b64String, expectedB64String);
});

test('b64.encode encodes buffer to Base64', async t => {
	const buffer = Buffer.from('This is a test string');
	const expectedB64String = buffer.toString('base64');

	const b64String = await b64.encode(buffer);

	t.is(b64String, expectedB64String);
});
