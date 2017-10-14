const net = require('net');
const EventEmitter = require('events');
const Client = require('./client');
const commands = require('../common/commands');

module.exports = class Server extends EventEmitter {
  constructor() {
    super();

    this.buf = new Buffer([]);
    this.len = -1;
    this.clients = [];
    this.server = net.createServer();
    this.server.on('connection', socket => this.onConnected(socket));
    this.server.on('error', () => console.log('server error'));
    this.server.on('listening', () => console.log('listening...'));
  }

  listen() {
    this.server.listen(23456);
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

  
}