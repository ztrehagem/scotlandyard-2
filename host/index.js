const uuid = require('uuid/v4');
const Server = require('./server');
const Game = require('./game');
const sender = require('../common/sender');

const State = {
  STANDBY: 'standby',
  GAME: 'game',
  FINISHED: 'finished',
};

const game = new Game();
const server = new Server();
const clients = [];
const getClientSockets = () => clients.map(client => client.getSocket());

let state = State.STANDBY;

server.on('client:connected', (client) => {
  client.id = uuid();
  clients.push(client);
  console.log('connected', client);
});

server.on('client:disconnected', (client) => {
  clients.splice(clients.indexOf(client), 1);
  console.log('disconnected', client);
});

server.on('client:message:set_name', ([client, body]) => {
  const name = body.toString();
  client.name = name;
  console.log('set_name', client);
});

exports.getClients = () => {
  return clients.map(client => {
    const filtered = Object.assign({}, client);
    delete filtered.getSocket;
    return filtered;
  });
};

exports.startGame = (thiefPlayerId) => {
  const client = clients.find(client => client.id = thiefPlayerId);
  client.thief = true;

  sender.startGame(getClientSockets(), game);
};

exports.loadGame = (filename) => {
  // TODO: implement
};

exports.saveGame = () => {
  // TODO: implement
};

server.listen();
