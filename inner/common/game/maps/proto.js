const { TicketType: { TAXI, BUS, TUBE, BLACK } } = require('../constants');
const { point: pt, dummy: dm, line: ln } = require('./classes/entity');
const Map = require('./classes/map');

module.exports = () => new Map(
  'proto',
  [
    pt(1, 10.0, 10.0, [2,3]),
    pt(2, 10.0, 20.0, [1,3], [3]),
    pt(3, 20.0, 10.0, [1,2], [3]),
  ],
  [
    dm(201, 20.0, 20.0),
  ],
  [
    ln(TAXI, 1, 2),
    ln(TAXI, 1, 3),
    ln(TAXI, 2, 3),
    ln(BUS, 2, 201),
    ln(BUS, 3, 201),
  ],
);
