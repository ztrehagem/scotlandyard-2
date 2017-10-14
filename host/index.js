const uuid = require('uuid/v4');
const Server = require('./server');
const Game = require('./game');
const sender = require('../common/sender');
const commands = require('../common/commands');

const State = {
  STANDBY: 'standby',
  GAME: 'game',
  FINISHED: 'finished',
};

module.exports = class Host {
  constructor() {
    this.game = null;
    this.server = null;
    this.state = null;
  }

  onClientConnected(hname) {
    console.log('connected', hname);
  }

  onClientDisconnected(hname) {
    console.log('disconnected', hname);
  }

  onClientMessage(client, message) {
    const cmd = message.readUInt8();
    const body = message.slice(1);
    const cmdName = commands[cmd];

    console.log('message', cmdName, body.toString());
  }

  start() {
    this.game = new Game();
    this.server = new Server();
    this.server.on('client:connected', hname => this.onClientConnected(hname));
    this.server.on('client:disconnected', hname => this.onClientDisconnected(hname));
    this.server.on('client:message', ([client, message]) => this.onClientMessage(client, message));
    this.state = State.STANDBY;
    return new Promise(res => this.server.listen(res));
  }

  startGame(thiefPlayerId) {
    if (this.state != State.STANDBY) return;

    const client = this.server.clients.find(client => client.id == thiefPlayerId);
    client.thief = true;

    // TODO: broadcast
    this.state = State.GAME;
  }

  loadGame(filename) {
    if (this.state != State.STANDBY) return;
    // TODO: implement
  }

  saveGame() {
    // TODO: implement
  }

  get clients() {
    return this.server.clients.map(client => client.serialize());
  }
}
