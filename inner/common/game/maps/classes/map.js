const { TicketType: { TAXI, BUS, TUBE, BLACK } } = require('../../constants');

module.exports = class Map {
  constructor(slug, points, dummyies, lines) {
    this.slug = slug;
    this.logicalMap = {};
    this.visualMap = {
      points: {},
      lines: [],
    };
    initLogicalMap(this.logicalMap, points);
    initVisualMap(this.visualMap, points, dummyies, lines);
  }
}

function initLogicalMap(map, points) {
  points.forEach((point) => {
    map[point.id] = {
      id: point.id,
      [TAXI]: point[TAXI],
      [BUS]: point[BUS],
      [TUBE]: point[TUBE],
      [BLACK]: point[BLACK],
    };
  });
}

function initVisualMap({points: mapPoints, lines: mapLines}, points, dummyies, lines) {
  points.forEach((point) => {
    mapPoints[point.id] = {
      id: point.id,
      x: point.x,
      y: point.y,
      [TAXI]: point[TAXI] && !!point[TAXI].length,
      [BUS]: point[BUS] && !!point[BUS].length,
      [TUBE]: point[TUBE] && !!point[TUBE].length,
    };
  });
  dummyies.forEach((point) => {
    mapPoints[point.id] = {
      dummy: true,
      id: point.id,
      x: point.x,
      y: point.y,
    };
  });
  mapLines.push(...lines);
}
