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

  eat(cell) {
    this.stomach += cell.grass;
    if (this.stomach >= 20) {
      this.stomach = 5;
      this.reproduce(cell);
    }
    // console.log(`goat ${this.id} has eaten ${this.stomach}`);
    cell.grass = 0;
  }

  metabolize() {
    this.stomach -= 0.1;
    if (this.stomach <= 0) {
      delete(state().board.goats[this.id]);
    }
  }

  move() {
    this.formerPosition.x = this.position.x;
    this.formerPosition.y = this.position.y;
    this.position.x += Random.intFromInterval(-1, 1);
    this.position.y += Random.intFromInterval(-1, 1);
    if (this.position.x <= 0) {
      this.position.x++;
    }
    if (this.position.y <= 0) {
      this.position.y++;
    }
    if (this.position.x >= this.constraint) {
      this.position.x--;
    }
    if (this.position.y >= this.constraint) {
      this.position.y--;
    }
    this.metabolize();
    if (this.formerPosition.x !== this.position.x || this.formerPosition.y !== this.position.y || this.stomach <= 0) {
      return this;
    }
  }
}

module.exports = Goat;
