const net = require('net');
const EventEmitter = require('events');
const Client = require('./client');
const commands = require('../common/commands');
const Sender = require('../common/sender');

module.exports = class Server extends EventEmitter {
  constructor() {
    super();

    this.buf = new Buffer([]);
    this.len = -1;
    this.clients = [];
    this.server = net.createServer();
    this.server.on('connection', socket => this.onConnected(socket));
    this.server.on('error', () => console.log('server error'));
    // this.server.on('listening', () => console.log('listening...'));
  }

  listen(port = 23456) {
    return new Promise(res => this.server.listen(port, res));
  }

  close() {
    return new Promise(res => this.server.close(res));
  }

  onConnected(socket) {
    const client = new Client(socket);
    this.clients.push(client);
    client.on('message', message => this.emit('client:message', [client, message]));
    client.once('disconnected', () => {
      client.removeAllListeners('message');
      this.clients.splice(this.clients.indexOf(client), 1);
      this.emit('client:disconnected', client.hostname)
    });
    this.emit('client:connected', client.hostname);
  }

  get clients_s() {
    return this.clients.map(client => client.serialize());
  }

  get sockets() {
    return this.clients.map(client => client.socket);
  }
}
