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

const game = new Game();
const server = new Server();

let state = State.STANDBY;

server.on('client:connected', (clientHostname) => {
  console.log('connected', clientHostname);
});

server.on('client:disconnected', (clientHostname) => {
  console.log('disconnected', clientHostname);
});

server.on('client:message', ([client, message]) => {
  const cmd = message.readUInt8();
  const body = message.slice(1);
  const cmdName = commands[cmd];

  console.log('message', cmdName, body.toString());
});

exports.getClients = () => server.clients.map(client => client.serialize());

exports.startGame = (thiefPlayerId) => {
  const thiefClient = server.clients.find(client => client.id == thiefPlayerId);
  thiefClient.thief = true;

  // broadcast 
};

exports.loadGame = (filename) => {
  // TODO: implement
};

exports.saveGame = () => {
  // TODO: implement
};

server.listen();
