'use strict';

const Cell = require('./cell');

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

class Board {
  constructor (boardSize) {
    this.cells = [];
    for (let x = 0; x < boardSize; x++) {
      this.cells.push([]);
      for (let y = 0; y < boardSize; y++) {
        this.cells[x].push(new Cell(x, y));
      }
    }
    const startX = randomIntFromInterval(0, boardSize - 1),
      startY = randomIntFromInterval(0, boardSize - 1);
    console.log(`starting at ${startX},${startY}`);
    this.cells[startX][startY].grass = 1;
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
