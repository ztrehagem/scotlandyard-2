const net = require('net');
const sender = require('../common/sender');
const Receiver = require('../common/receiver');
const commands = require('../common/commands');
const Messenger = require('../common/messenger');

module.exports = class Client {
  constructor() {
    this.socket = null;
    this.receiver = null;
    this.buf = new Buffer([]);
    this.len = -1;
    this.thief = false;
  }

  async connect() {
    await new Promise(res => this.socket = net.createConnection(23456, '127.0.0.1', res));
    this.receiver = new Receiver(this.socket);
    this.receiver.on('message', message => this.onMessage(message));
    this.receiver.on('end', () => this.onEnd());
  }

  disconnect() {
    return new Promise(res => this.socket.close(res));
  }

  onMessage(message) {
    const [cmd, cmdName, body] = Messenger.parse(message);

    console.log('message', cmdName, body.toString());
  }

  onEnd() {
    console.log('disconnected from server');
  }

  setName(name) {
    return sender.send(this.socket, commands.SET_NAME, Buffer.from(name));
  }

  actPolice(id, movement) {
    // sender.send(this.socket, commands.ACT_POLICE, Buffer.from());
  }

  actThief(movement, movement2) {
    // sender.send(this.socket, commands.ACT_THIEF, Buffer.from());
  }
}
