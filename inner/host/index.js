const uuid = require('uuid/v4');
const Server = require('./server');
const Game = require('../common/game');
const sender = require('../common/sender');
const commands = require('../common/commands');
const Messenger = require('../common/messenger');

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

  close() {
    this.game = null;
    this.state = null;
    return this.server.close();
  }

  onClientConnected(hname) {
    console.log('connected', hname);
    // this.notifyAll();
  }

  onClientDisconnected(hname) {
    console.log('disconnected', hname);
    this.notifyAll();
  }

  onClientMessage(client, message) {
    const [cmd, cmdName, body] = Messenger.parse(message);

    switch (cmd) {
      case commands.SET_NAME:
        client.name = body.toString();
        console.log('setname', client.hostname, client.name);
        this.notifyAll();
        break;
      case commands.FETCH:
        console.log('fetch', client.hostname);
        this.notify(client);
        break;
      case commands.ACT_POLICE:
        if (client.thief) return;
        console.log('act_police', client.hostname);
        this.actPolice(JSON.parse(body.toString()));
        break;
      case commands.ACT_THIEF:
        if (!client.thief) return;
        console.log('act_thief', client.hostname);
        this.actThief(JSON.parse(body.toString()));
        break;
      default:
        console.log('unknown command', cmd);
    }
  }

  actPolice({id, movement}) {
    try {
      this.game.actPolice(id, movement);
      this.notifyAll();
    } catch (e) {
      console.log('error on actPolice', e);
    }
  }

  actThief({movement, movement2}) {
    try {
      this.game.actThief(movement, movement2);
      this.notifyAll();
    } catch (e) {
      console.log('error on actThief', e);
    }
  }

  start(port) {
    this.server = new Server();
    this.server.on('client:connected', hname => this.onClientConnected(hname));
    this.server.on('client:disconnected', hname => this.onClientDisconnected(hname));
    this.server.on('client:message', ([client, message]) => this.onClientMessage(client, message));
    this.state = State.STANDBY;
    return this.server.listen(port);
  }

  startGame() {
    if (this.state != State.STANDBY) return;
    if (this.server.clients.every(client => !client.thief)) return;
    this.state = State.GAME;
    this.game = this.game || new Game();
    return this.notifyAll();
  }

  setThiefPlayer(thiefPlayerId) {
    this.server.clients.forEach((client) => client.thief = client.id == thiefPlayerId);
    return this.notifyAll();
  }

  makeInfo() {
    return {
      game: this.game && this.game.serialize(),
      clients: this.server.clients_s,
      time: Date.now(),
    };
  }

  notify(client) {
    const body = JSON.stringify(this.makeInfo());
    return sender.send(client.socket, commands.GAME, Buffer.from(body));
  }

  notifyAll() {
    const body = JSON.stringify(this.makeInfo());
    return sender.sendAll(this.server.sockets, commands.GAME, Buffer.from(body));
  }

  loadGame(filename) {
    if (this.state != State.STANDBY) return;
    // TODO: implement
  }

  saveGame() {
    // TODO: implement
  }
}
