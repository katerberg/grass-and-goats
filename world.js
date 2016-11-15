'use strict';

function randomIntFromInterval(min,max)
{
  return Math.floor(Math.random()*(max-min+1)+min);
}

function numberOfGrassNeighbors(board, cellX, cellY) {
  let result = 0;
  if (cellX !== 0) {
    result += board[cellX - 1][cellY].grass;
  }
  if (cellX !== board.length - 1) {
    result += board[cellX + 1][cellY].grass;
  }
  if (cellY !== 0) {
    result += board[cellX][cellY - 1].grass;
  }
  if (cellY !== board[cellX].length - 1) {
    result += board[cellX][cellY + 1].grass;
  }
  return result;
}

function buildWorld(boardSize) {
  const board = [];
  for (let x = 0; x < boardSize; x++) {
    board.push([]);
    for (let y = 0; y < boardSize; y++) {
      board[x].push({
        grass: 0,
        x: x,
        y: y,
      });
    }
  }
  const startX = randomIntFromInterval(0, boardSize - 1),
    startY = randomIntFromInterval(0, boardSize - 1);
  board[startX][startY].grass = 1;
  return board;
}

class World {
  constructor (size) {
    this.age = 0;
    this.watchers = [];
    this.board = buildWorld(size);
  }

  checkForGrowth() {
    const result = [];
    this.board.forEach(row => row.forEach(cell => {
      const neighbors = numberOfGrassNeighbors(this.board, cell.x, cell.y);
      if (!cell.grass && Math.random() < neighbors * 0.05) {
        result.push(cell);
      }
    }));
    result.forEach(cell => {
      cell.grass = 1;
      this.board[cell.x][cell.y].grass = 1;
    });
    return result;
  }
}

module.exports = World;
