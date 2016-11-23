'use strict';

const Cell = require('./cell');
const Goat = require('./goat');
const Random = require('./random');

class Board {
  constructor (boardSize) {
    this.goats = [];
    this.cells = [];
    for (let x = 0; x < boardSize; x++) {
      this.cells.push([]);
      for (let y = 0; y < boardSize; y++) {
        this.cells[x].push(new Cell(x, y));
      }
    }
    const startX = Random.intFromInterval(0, boardSize - 1),
      startY = Random.intFromInterval(0, boardSize - 1);
    console.log(`Starting grass at ${startX},${startY}`);
    this.cells[startX][startY].grass = 1;
  }

  spawnGoat() {
    const startX = Random.intFromInterval(0, this.cells.length - 1),
      startY = Random.intFromInterval(0, this.cells.length - 1);
    console.log(`Creating goat at ${startX},${startY}`);
    this.goats.push(new Goat(this.cells.length, startX, startY));
  }

  moveGoats() {
    return this.goats.map(goat => goat.move()).filter(delta => delta);
  }

  growGrass() {
    const result = [];
    this.cells.forEach(row => row.forEach(cell => {
      const neighbors = this.getNeighbors(cell.x, cell.y);
      const growth = cell.grow(neighbors);
      if (growth) {
        result.push(cell);
      }
    }));
    return result;
  }

  getNeighbors(cellX, cellY) {
    const result = [];
    if (cellX !== 0) {
      result.push(this.cells[cellX - 1][cellY]);
    }
    if (cellX !== this.cells.length - 1) {
      result.push(this.cells[cellX + 1][cellY]);
    }
    if (cellY !== 0) {
      result.push(this.cells[cellX][cellY - 1]);
    }
    if (cellY !== this.cells[cellX].length - 1) {
      result.push(this.cells[cellX][cellY + 1]);
    }
    return result;
  }
}

module.exports = Board;
