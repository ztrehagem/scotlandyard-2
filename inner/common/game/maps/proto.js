const { TicketType: { TAXI, BUS, TUBE, BLACK } } = require('../constants');
const { Map, point: pt, dummy: dm, line: ln } = require('./classes/map');

module.exports = new Map('proto', {
  points: [
    pt(1, 5.0, 5.0, [2,3], [], [2], [3]),
    pt(2, 5.0, 10.0, [1,3], [3], [1]),
    pt(3, 12.0, 7.0, [1,2], [3], [], [1]),
  ],
  dummyies: [
    dm(201, 10.0, 10.0),
  ],
  lines: [
    ln(TAXI, 1, 2),
    ln(TAXI, 1, 3),
    ln(TAXI, 2, 3),
    ln(BUS, 2, 201),
    ln(BUS, 3, 201),
    ln(TUBE, 1, 2),
    ln(BLACK, 1, 3),
  ],
});
