import inner from '../inner';

const { TAXI, BUS, TUBE, BLACK } = inner.ticketTypes;
const pointsToHash = points => points.reduce((converted, point) => Object.assign(converted, {[point.id]: point}), {});
const COLORS = {
  [TAXI]: '#fb0',
  [BUS]: '#0b0',
  [TUBE]: '#f52',
  [BLACK]: '#000',
};
const LINE_OFFSET = {
  [TAXI]: 0,
  [BUS]: -4,
  [TUBE]: +4,
  [BLACK]: +8,
};
const ratio = 10;
const boxWidth = 2 * ratio;

class Point {
  constructor({id, x, y, [TAXI]: taxi, [BUS]: bus, [TUBE]: tube, [BLACK]: black}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this[TAXI] = taxi;
    this[BUS] = bus;
    this[TUBE] = tube;
    this[BLACK] = black;
  }

  draw(ctx) {
    if (this[TAXI].length) {
      ctx.fillStyle = COLORS[TAXI];
      ctx.fillRect(this.x * ratio, this.y * ratio, boxWidth, boxWidth);
    }
    if (this[BUS].length) {
      ctx.fillStyle = COLORS[BUS];
      ctx.fillRect(this.x * ratio, this.y * ratio + boxWidth * 3 / 4 + 1, boxWidth, boxWidth / 4);
    }
    if (this[TUBE].length) {
      ctx.fillStyle = COLORS[TUBE];
      ctx.fillRect(this.x * ratio, this.y * ratio + boxWidth / 4, boxWidth, boxWidth / 2);
    }
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x * ratio, this.y * ratio, boxWidth, boxWidth);
    ctx.textAlign = 'center';
    ctx.font = "15px sans-serif";
    ctx.fillStyle = '#000';
    ctx.fillText(this.id, this.x * ratio + boxWidth / 2, this.y * ratio + boxWidth / 2 + 6);
  }
}

class Line {
  constructor({type, a, b}, points) {
    this.style = COLORS[type];
    this.offset = LINE_OFFSET[type] + boxWidth / 2;
    this.a = points[a];
    this.b = points[b];
    this.lineDash = type == TUBE;
  }

  draw(ctx) {
    ctx.strokeStyle = this.style;
    if (this.lineDash) ctx.setLineDash([5, 5]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.a.x * ratio + this.offset, this.a.y * ratio + this.offset);
    ctx.lineTo(this.b.x * ratio + this.offset, this.b.y * ratio + this.offset);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export default class MapCanvasController {
  constructor($canvas, {slug, points, dummyies, lines}) {
    this.$canvas = $canvas;
    this.ctx = this.$canvas.getContext('2d');

    this.pointsHash = pointsToHash([...points, ...dummyies]);
    this.points = points.map(point => new Point(point));
    this.lines = lines.map(line => new Line(line, this.pointsHash));
  }

  resetSize($parent) {
    const {width} = $parent.getBoundingClientRect();
    const height = width * 3 / 4;
    this.$canvas.setAttribute('width', width);
    this.$canvas.setAttribute('height', height);
    this.redraw();
  }

  redraw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.lines.forEach(line => line.draw(this.ctx));
    this.points.forEach(point => point.draw(this.ctx));
  }

  get width() {
    return parseInt(this.$canvas.getAttribute('width'));
  }

  get height() {
    return parseInt(this.$canvas.getAttribute('height'));
  }
}
