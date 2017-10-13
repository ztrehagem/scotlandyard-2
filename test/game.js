const Game = require('../server/game');

const game = new Game();

console.log(require('util').inspect(game, { depth: null }));

module.exports = game;
