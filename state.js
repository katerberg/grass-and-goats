'use strict';
const World = require('./world');
const world = new World(60);

function tick(ageUntil) {
  var worldTick = world.tick();
  world.watchers.forEach(function(watcher) {
    watcher.emit('tick', worldTick);
  });
  if (world.age <= ageUntil) {
    if (world.age == ageUntil) {
      world.spawnGoat(world.board.startX, world.board.startY);
    }
    tick(ageUntil);
  } else {
    setTimeout(tick, 100);
  }
}

tick(200);

module.exports = world;
