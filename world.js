'use strict';
var Board = require('./board');


class World {
  constructor (size) {
    this.age = 0;
    this.watchers = [];
    this.board = new Board(size);
  }

  tick() {
    const result = [];
    this.board.cells.forEach(row => row.forEach(cell => {
      cell.neighbors = this.board.numberOfGrassNeighbors(cell.x, cell.y);
      if (cell.grass < 0.95) {
        cell.push = {};
        if (Math.random() < cell.neighbors * 0.1) {
          cell.push.spread = true;
        }
        if (cell.grass !== 0) {
          cell.push.grow = true;
        }
        if (Object.keys(cell.push).length) {
          result.push(cell);
        }
      }
    }));
    result.forEach(cell => {
      if (cell.push.spread) {
        cell.grass += 0.1;
      }
      if (cell.push.grow) {
        cell.grass += (0.05 - 0.01 * cell.neighbors);
      }
      this.board.cells[cell.x][cell.y].grass = cell.grass;
    });
    return result;
  }
}

module.exports = World;
