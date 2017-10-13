const Movement = require('./movement');
const { PlayerType, TicketType } = require('./constants');

const DefaultTickets = {
  [PlayerType.THIEF]: {
    [TicketType.TAXI]: 4,
    [TicketType.BUS]: 3,
    [TicketType.TUBE]: 3,
    [TicketType.BLACK]: 2,
    [TicketType.DOUBLE]: 2,
  },
  [PlayerType.POLICE]: {
    [TicketType.TAXI]: 10,
    [TicketType.BUS]: 8,
    [TicketType.TUBE]: 4,
  },
};

module.exports = class Player {
  constructor(playerType, initialPosition) {
    this.initialPosition = initialPosition;
    this.history = [];
    this.tickets = DefaultTickets[playerType];
  }

  move(movement, movement2) {
    if (!this.hasTicket(movement.type)) {
      throw new Error('Player#move : no ticket');
    }

    if (movement2 && (!this.hasTicket(TicketType.DOUBLE) || !this.hasTicket(movement2.type))) {
      throw new Error('Player#move : no ticket for double');
    }

    // TODO: do validation for position

    this.consumeTicket(movement.type);
    this.history.push(movement);
    if (movement2) {
      this.consumeTicket(movement2.type);
      this.history.push(movement2);
    }
  }

  give(type) {
    ++this.tickets[type];
  }

  hasTicket(type) {
    return !!this.tickets[type];
  }

  consumeTicket(type) {
    --this.tickets[type];
  }

  get position() {
    if (!this.history.length) {
      return this.initialPosition;
    } else {
      return this.history[this.history.length - 1].dest;
    }
  }
}
