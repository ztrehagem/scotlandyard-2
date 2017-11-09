const { TicketType: { TAXI, BUS, TUBE, BLACK } } = require('../../constants');

// const pointsToHash = points => points.reduce((converted, point) => Object.assign(converted, {[point.id]: point}), {});

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
exports.line = (type, a, b) => ({type, a, b});


exports.Map = class {
  constructor(slug, {points, dummyies, lines}) {
    this.slug = slug;
    this.points = points;
    this.dummyies = dummyies;
    this.lines = lines;
  }
};
