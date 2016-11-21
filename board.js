'use strict';

const Grass = require('./grass');

function randomIntFromInterval(min,max)
{
  return Math.floor(Math.random()*(max-min+1)+min);
}

class Board {
  constructor (boardSize) {
    this.cells = [];
    for (let x = 0; x < boardSize; x++) {
      this.cells.push([]);
      for (let y = 0; y < boardSize; y++) {
        this.cells[x].push({
          grass: new Grass(),
          x: x,
          y: y,
        });
      }
    }
    const startX = randomIntFromInterval(0, boardSize - 1),
      startY = randomIntFromInterval(0, boardSize - 1);
    this.cells[startX][startY].grass.state = 1;
  }

  growGrass() {
    const result = [];
    this.cells.forEach(row => row.forEach(cell => {
      const neighbors = this.getNeighbors(cell.x, cell.y);
      const growth = cell.grass.grow(neighbors);
      if (growth) {
        result.push(cell);
      }
    }));
    return result;
  }

  getNeighbors(cellX, cellY) {
    const result = [];
    if (cellX !== 0) {
      result.push(this.cells[cellX - 1][cellY].grass);
    }
    if (cellX !== this.cells.length - 1) {
      result.push(this.cells[cellX + 1][cellY].grass);
    }
    if (cellY !== 0) {
      result.push(this.cells[cellX][cellY - 1].grass);
    }
    if (cellY !== this.cells[cellX].length - 1) {
      result.push(this.cells[cellX][cellY + 1].grass);
    }
    return result;
  }
}

module.exports = Board;
