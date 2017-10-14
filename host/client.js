const EventEmitter = require('events');
const uuid = require('uuid/v4');

module.exports = class Client extends EventEmitter {
  constructor(socket) {
    super();

    this.id = uuid();
    this.address = socket.remoteAddress;
    this.port = socket.remotePort;
    this.socket = socket;
    this.name = null;
    this.thief = false;

    this.buf = new Buffer([]);
    this.len = -1;
    this.socket.on('data', (chunk) => this.onData(chunk));
    this.socket.on('end', () => this.onEnd());
  }

  get hostname() {
    return `${this.address}:${this.port}`;
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      thief: this.thief,
    };
  }

  onData(chunk) {
    this.buf = Buffer.concat([this.buf, chunk]);
    this.checkBuf();
  }

  checkBuf() {
    if (this.len == -1) {
      if (this.buf.length < 4) {
        return;
      } else {
        this.len = this.buf.readUInt32BE();
        this.buf = this.buf.slice(4);
      }
    }

    if (this.buf.length >= this.len) {
      const message = this.buf.slice(0, this.len);
      this.buf = this.buf.slice(this.len);
      this.len = -1;
      this.emit('message', message);
      this.checkBuf();
    }
  }

  onEnd() {
    this.emit('disconnected');
  }
}
