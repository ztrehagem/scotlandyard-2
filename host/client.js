const EventEmitter = require('events');
const uuid = require('uuid/v4');
const Receiver = require('../common/receiver');

module.exports = class Client extends EventEmitter {
  constructor(socket) {
    super();

    this.id = uuid();
    this.address = socket.remoteAddress;
    this.port = socket.remotePort;
    this.socket = socket;
    this.receiver = new Receiver(this.socket);
    this.receiver.on('message', message => this.onMessage(message));
    this.receiver.on('end', () => this.onEnd());
    this.name = null;
    this.thief = false;
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

  onMessage(message) {
    this.emit('message', message);
  }

  onEnd() {
    this.emit('disconnected');
  }
}
