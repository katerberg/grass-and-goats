'use strict';

class Cell {
  constructor (x, y) {
    this.grass = 0;
    this.x = x;
    this.y = y;
  }

  grassSurrounding(neighbors) {
    const amountSurroung = neighbors.reduce((sum, neighbor) => {
      return sum + neighbor.grass;
    }, 0);
    if (amountSurroung > 10) {
      // console.log(amountSurroung);
    }
    return amountSurroung;
  }

  becomesColonized(neighbors) {
    return Math.random() < 0.05 * this.grassSurrounding(neighbors);
  }

  naturalGrowth(neighbors) {
    let growth = (0.01 + Math.random()) * 0.05;
    let overpopulation = this.grassSurrounding(neighbors) * 0.01;
    return growth - overpopulation;
  }

  grow(neighbors) {
    let startingState = this.grass;
    if (this.grass !== 0) {
      this.grass += this.naturalGrowth(neighbors);
    }
    if (this.becomesColonized(neighbors)) {
      this.grass += 0.1;
    }
    if (this.grass > 1) {
      this.grass = 1;
    }
    return startingState !== this.grass;
  }
}

module.exports = Cell;
