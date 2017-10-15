const net = require('net');
const EventEmitter = require('events');
const Game = require('../common/game');
const sender = require('../common/sender');
const Receiver = require('../common/receiver');
const commands = require('../common/commands');
const Messenger = require('../common/messenger');

module.exports = class Client extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.receiver = null;
    this.buf = new Buffer([]);
    this.len = -1;
    this.thief = false;
    this.game = null;
    this.time = null;
    this.clients = [];
  }

  async connect(port = 23456, address = '127.0.0.1') {
    await new Promise(res => this.socket = net.createConnection(port, address, res));
    this.receiver = new Receiver(this.socket);
    this.receiver.on('message', message => this.onServerMessage(message));
    this.receiver.on('end', () => this.onEnd());
  }

  disconnect() {
    return new Promise(res => this.socket.close(res));
  }

  onServerMessage(message) {
    const [cmd, cmdName, body] = Messenger.parse(message);

    switch (cmd) {
      case commands.GAME:
        const {game, time, clients} = JSON.parse(body.toString());
        if (this.time > time) break;
        this.game = game;
        this.time = time;
        this.clients = clients;
        this.emit('update', this);
        console.log('updated game', time);
        break;
      default:
        console.log('unknown command', cmd);
    }
  }

  onEnd() {
    console.log('disconnected from server');
  }

  setName(name) {
    return sender.send(this.socket, commands.SET_NAME, Buffer.from(name));
  }

  fetch() {
    return sender.send(this.socket, commands.FETCH);
  }

  actPolice(id, movement) {
    const body = JSON.stringify({id, movement});
    return sender.send(this.socket, commands.ACT_POLICE, Buffer.from(body));
  }

  actThief(movement, movement2) {
    const body = JSON.stringify({movement, movement2});
    return sender.send(this.socket, commands.ACT_THIEF, Buffer.from(body));
  }
}
