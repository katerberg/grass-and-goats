'use strict';
const Random = require('./random');

class Goat {
  constructor (constraint, x, y) {
    this.position = {
      x: x,
      y: y,
    };
    this.formerPosition = {};
    this.constraint = constraint;
  }

  move() {
    this.formerPosition.x = this.position.x;
    this.formerPosition.y = this.position.y;
    this.position.x += Random.intFromInterval(-1, 1);
    this.position.y += Random.intFromInterval(-1, 1);
    if (this.position.x === 0) {
      this.position.x++;
    }
    if (this.position.y === 0) {
      this.position.y++;
    }
    if (this.position.x === this.constraint) {
      this.position.x--;
    }
    if (this.position.y === this.constraint) {
      this.position.y--;
    }
    if (this.formerPosition.x !== this.position.x || this.formerPosition.y !== this.position.y) {
      return this;
    }
  }
}

module.exports = Goat;
