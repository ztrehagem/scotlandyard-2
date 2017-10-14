const net = require('net');
const Game = require('../common/game');
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
    this.game = null;
    this.time = null;
    this.clients = [];
  }

  async connect() {
    await new Promise(res => this.socket = net.createConnection(23456, '127.0.0.1', res));
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
        this.game = game;
        this.time = time;
        this.clients = clients;
        console.log(time);
        console.log(clients);
        console.log(game);
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
