const string = 'This is a test string';
const buffer = Buffer.from(string);
const base64 = buffer.toString('base64');

module.exports = {
  string,
  buffer,
  base64
};
