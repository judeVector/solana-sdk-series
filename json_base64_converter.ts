const fs = require('fs');

const keyArray = JSON.parse(fs.readFileSync('./wallet.json')); // update this path
const keyBuffer = Buffer.from(keyArray); // should be 64 bytes
const base64 = keyBuffer.toString('base64');

console.log(base64);

