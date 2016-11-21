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
    this.cells[startX][startY].grass = new Grass(1);
  }

  growGrass() {
    const result = [];
    this.cells.forEach(row => row.forEach(cell => {
      cell.neighbors = this.numberOfGrassNeighbors(cell.x, cell.y);
      if (cell.grass.state < 0.95) {
        cell.push = {};
        if (Math.random() < cell.neighbors * 0.1) {
          cell.push.spread = true;
        }
        if (cell.grass.state !== 0) {
          cell.push.grow = true;
        }
        if (Object.keys(cell.push).length) {
          result.push(cell);
        }
      }
    }));
    result.forEach(cell => {
      if (cell.push.spread) {
        cell.grass.state += 0.1;
      }
      if (cell.push.grow) {
        cell.grass.state += (0.05 - 0.01 * cell.neighbors);
      }
      this.cells[cell.x][cell.y].grass = cell.grass;
    });
    return result;
  }

  numberOfGrassNeighbors(cellX, cellY) {
    let result = 0;
    if (cellX !== 0) {
      result += this.cells[cellX - 1][cellY].grass.state;
    }
    if (cellX !== this.cells.length - 1) {
      result += this.cells[cellX + 1][cellY].grass.state;
    }
    if (cellY !== 0) {
      result += this.cells[cellX][cellY - 1].grass.state;
    }
    if (cellY !== this.cells[cellX].length - 1) {
      result += this.cells[cellX][cellY + 1].grass.state;
    }
    return result;
  }
}

module.exports = Board;
