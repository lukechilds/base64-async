const buffer = Buffer.from([0x72, 0x98, 0x4f, 0x96, 0x75, 0x03, 0xcd, 0x28, 0x38, 0xbf]);
const base64 = buffer.toString('base64');
const hexString = buffer.toString('hex');

module.exports = {
  buffer,
  base64,
  hexString
};
