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
    return this.board.growGrass();
  }
}

module.exports = World;
