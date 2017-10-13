const EventEmitter = require('events');
const Player = require('./player');
const { PlayerType } = require('./constants');

const initials = [155,198,26,34,197,94,50,174,29,13,132,91,112,138,103,117,53,141];
const getInitial = () => initials.splice(Math.random() * initials.length, 1)[0];
const thiefOpenTurns = [3,8,13,18,24];

module.exports = class Game extends EventEmitter {
  constructor() {
    super();
    this.thief = new Player(PlayerType.THIEF, getInitial());
    this.polices = new Array(5).fill(0).map(() => new Player(PlayerType.POLICE, getInitial()));
    this.turn = 1;
    this.player = PlayerType.THIEF;
    this.activePoliceId = 0;
  }

  actThief(movement, movement2) {
    if (this.player != PlayerType.THIEF) {
      throw new Error('Game#actThief : not thief turn');
    }
    this.thief.move(movement, movement2);
    this.switchTurnToPolice();
  }

  actPolice(id, movement) {
    if (this.player != PlayerType.POLICE) {
      throw new Error('Game#actPolice : not police turn');
    }
    if (this.activePoliceId != id) {
      throw new Error(`Game#actPolice : police ${id} is not active`);
    }

    this.polices[id].move(movement);
    this.thief.give(movement.type);
    ++this.activePoliceId;

    if (this.activePoliceId == this.polices.length) {
      this.switchTurnToThief();
    }
  }

  switchTurnToPolice() {
    this.player = PlayerType.POLICE;
    this.activePoliceId = 0;
    this.emit('switch-turn:police');
  }

  switchTurnToThief() {
    this.player = PlayerType.THIEF;
    ++this.turn;
    this.emit('switch-turn:thief');
  }

  get thiefMovements() {
    return this.thief.history.filter((movement, index) => thiefOpenTurns.some(turn => turn == index - 1));
  }
}
