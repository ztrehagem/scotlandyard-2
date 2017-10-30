const EventEmitter = require('events');
const Host = require('./host');
const Client = require('./client');

module.exports = new (class Inner extends EventEmitter {
  constructor() {
    super();
    this.host = null;
    this.client = null;
  }

  async clean() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
    if (this.host) {
      await this.host.close();
      this.host = null;
    }
  }

  // host
  hasHost() {
    return !!this.host;
  }

  async startHost(port, name) {
    await this.clean();
    this.host = new Host();
    await this.host.start(parseInt(port) || undefined);
    await this._initClient(name, port);
  }

  setThiefPlayer(thiefPlayerId) {
    return this.host.setThiefPlayer(thiefPlayerId);
  }

  startGame() {
    return this.host.startGame();
  }

  // client
  async startClient(address, port, name) {
    this.clean();
    await this._initClient(name, port, address);
  }

  fetch() {
    return this.client.fetch();
  }

  getGame() {
    return this.client.game;
  }

  getClients() {
    return this.client.clients;
  }

  getMapJSON() {
    return JSON.stringify(this.client.map);
  }

  actPolice(id, movement) {
    return this.client.actPolice(id, movement);
  }

  actThief(movement, movement2) {
    return this.client.actThief(movement, movement2);
  }

  // private
  async _initClient(name, port, address) {
    this.client = new Client();
    this.client.on('update', () => this.emit('update'));
    await this.client.connect(parseInt(port) || undefined, address);
    await this.client.setName(name);
  }
});
