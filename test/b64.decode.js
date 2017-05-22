import test from 'ava';
import b64 from '../';
import values from './fixtures/values';

test('b64.decode returns a Promise', t => {
	const returnValue = b64.decode(values.string);
	t.true(returnValue instanceof Promise);
});
