import test from 'ava';
import b64 from '../';

test('b64 is a function', t => {
	t.is(typeof b64, 'function');
});

test('b64.encode is a function', t => {
	t.is(typeof b64.encode, 'function');
});
