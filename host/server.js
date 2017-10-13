const net = require('net');
const EventEmitter = require('events');
const commands = require('../common/commands');

module.exports = class Server extends EventEmitter {
  constructor() {
    super();

    this.buf = new Buffer([]);
    this.len = -1;
    this.server = net.createServer(socket => this.onConnected(socket));

    this.server.on('error', () => console.log('server error'));
    this.server.on('listening', () => console.log('listening...'));
  }

  listen() {
    this.server.listen(23456);
  }

  onConnected(socket) {
    this.client = {
      address: socket.remoteAddress,
      port: socket.remotePort,
      getSocket: () => socket,
    };
    socket.on('data', (chunk) => this.onData(chunk));
    socket.on('end', () => this.onEnd());
    this.emit('client:connected', this.client);
  }

  onData(chunk) {
    this.buf = Buffer.concat([this.buf, chunk]);
    this.checkBuf();
  }

  onEnd() {
    this.emit('client:disconnected', this.client);
  }

  checkBuf() {
    if (this.len == -1) {
      if (this.buf.length < 4) {
        return; // await more chunks
      } else {
        this.len = this.buf.readUInt32BE();
        this.buf = this.buf.slice(4);
      }
    }

    if (this.buf.length >= this.len) {
      const message = this.buf.slice(0, this.len);
      this.buf = this.buf.slice(this.len);
      this.len = -1;
      this.receiveMessage(message);
    }
  }

  receiveMessage(message) {
    const cmd = message.readUInt8();
    const body = message.slice(1);
    const cmdName = commands[cmd];
    if (cmdName) {
      this.emit(`client:message:${cmdName}`, [this.client, body]);
    } else {
      console.log('unknown command', cmd);
    }
  }
}
