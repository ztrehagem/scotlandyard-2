const net = require('net');
const sender = require('../common/sender');
const commands = require('../common/commands');

module.exports = class Client {
  constructor() {
    this.socket = null;
  }

  connect() {
    return new Promise((res) => {
      this.socket = net.createConnection(23456, '127.0.0.1', res);
    });
  }

  setName(name) {
    return sender.send(this.socket, commands.SET_NAME, Buffer.from(name));
  }
}
