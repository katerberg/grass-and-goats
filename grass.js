'use strict';

class Grass {
  constructor (state) {
    this.state = state ? state : 0;
    this.neighbors = [];
  }

  grassSurrounding(neighbors) {
    return neighbors.reduce((sum, neighbor) => {
      return sum + neighbor.state;
    }, 0);
  }

  becomesColonized(neighbors) {
    return Math.random() < 0.1 * this.grassSurrounding(neighbors);
  }

  grow(neighbors) {
    let startingState = this.state;
    if (this.state < 0.95) {
      if (this.state !== 0) {
        this.state += (0.05 - 0.01 * this.grassSurrounding(neighbors));
      }
      if (this.becomesColonized(neighbors)) {
        this.state += 0.1;
      }
    }
    return startingState !== this.state;
  }
}

module.exports = Grass;
