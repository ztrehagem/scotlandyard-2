const net = require('net');
const readline = require('readline');
const sender = require('../common/sender');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = str => new Promise(res => reader.question(str, ans => res(ans)));

const socket = net.createConnection(23456, '127.0.0.1', async () => {
  const name = await question('name: ');
  await sender.setName(socket, name);
});
