'use strict';
var Board = require('./board');

class World {
  constructor (size) {
    this.age = 0;
    this.watchers = [];
    this.board = new Board(size);
  }

  tick() {
    this.age++;
    const grassDelta = this.board.growGrass();
    const goatsDelta = this.board.moveGoats();
    return {
      grass: grassDelta,
      goats: goatsDelta,
    };
  }

  spawnGoat(x, y) {
    this.board.spawnGoat(x, y);
  }
}

module.exports = World;
