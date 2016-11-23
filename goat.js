'use strict';
const Random = require('./random');

function state() {
  return require('./state');
}

class Goat {
  constructor (constraint, x, y) {
    this.id = Math.random();
    this.position = {
      x: x,
      y: y,
    };
    this.stomach = 5;
    this.formerPosition = {};
    this.constraint = constraint;
  }

  reproduce(cell) {
    const world = state();
    let goatX;
    if (cell.x !== 0) {
      goatX = cell.x - 1;
    } else {
      goatX = cell.x + 1;
    }
    const newGoat = new Goat(this.constraint, goatX, cell.y);
    world.board.goats[newGoat.id] = newGoat;
  }

  tick(cell) {
    this.metabolize();
    if (cell.grass > 0) {
      return this.eat(cell);
    } else {
      return this.move();
    }
  }

  eat(cell) {
    this.stomach += 0.5;
    if (this.stomach >= 20) {
      this.stomach = 5;
      this.reproduce(cell);
    }
    cell.grass -= 0.5;
  }

  metabolize() {
    this.stomach -= 0.2;
    if (this.stomach <= 0) {
      delete(state().board.goats[this.id]);
    }
  }

  move() {
    this.formerPosition.x = this.position.x;
    this.formerPosition.y = this.position.y;
    this.position.x += Random.intFromInterval(-1, 1);
    this.position.y += Random.intFromInterval(-1, 1);
    if (this.position.x < 0) {
      this.position.x++;
    }
    if (this.position.y < 0) {
      this.position.y++;
    }
    if (this.position.x >= this.constraint) {
      this.position.x--;
    }
    if (this.position.y >= this.constraint) {
      this.position.y--;
    }
    if (this.formerPosition.x !== this.position.x || this.formerPosition.y !== this.position.y || this.stomach <= 0) {
      return this;
    }
  }
}

module.exports = Goat;
