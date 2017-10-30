const { TicketType: { TAXI, BUS, TUBE, BLACK } } = require('../../constants');

exports.point = (id, x, y, taxi, bus, tube, black) => ({
  id,
  x,
  y,
  [TAXI]: taxi || [],
  [BUS]: bus || [],
  [TUBE]: tube || [],
  [BLACK]: black || [],
});
exports.dummy = (id, x, y) => ({id, x, y});
exports.line = (type, point1, point2) => ({type, point1, point2});
