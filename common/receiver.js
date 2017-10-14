const EventEmitter = require('events');

module.exports = class Receiver extends EventEmitter {
  constructor(socket) {
    super();

    this.socket = socket;
    this.buf = new Buffer([]);
    this.len = -1;
    this.socket.on('data', chunk => this.onData(chunk));
    this.socket.on('end', () => this.onEnd());
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
    this.emit('end');
  }
}
