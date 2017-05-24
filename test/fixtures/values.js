const buffer = Buffer.from('This is a test string');
const base64 = buffer.toString('base64');
const hexString = buffer.toString('hex');

module.exports = {
  buffer,
  base64,
  hexString
};
