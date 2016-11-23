(function() {
  'use strict';

  var socket = io();

  socket.on('tick', function(worldChanges) {
    worldChanges.goats.forEach(function(goat) {
      if (goat.formerPosition.x) {
        var row = $($('#board').children()[goat.formerPosition.x]);
        var cell = $(row.children()[goat.formerPosition.y]);
        cell.css('background-color', 'rgb(255,255,255)');
      }
    });
    worldChanges.grass.forEach(function(cellChange) {
      var row = $($('#board').children()[cellChange.x]);
      var cell = $(row.children()[cellChange.y]);
      cell.css('background-color', getBackgroundColor(cellChange.grass));
    });
    worldChanges.goats.forEach(function(goat) {
      if (goat.stomach > 0) {
        var row = $($('#board').children()[goat.position.x]);
        var cell = $(row.children()[goat.position.y]);
        cell.css('background-color', 'rgb(255,0,0)');
      } else {
        console.log('killing goat' + JSON.stringify(goat));
      }
    });
  });
  
  function getBackgroundColor(grass) {
    var depth = Math.floor(255 * Math.abs(1 - grass));
    return 'rgb(' +
      depth + ',' + depth + ',' + depth +
      ')';
  }

  function buildRow(row) {
    var domRow = '<div class="row">';
    row.forEach(function(cell) {
      domRow += '<div class="cell"';
      if (cell.grass) {
        domRow += 'style="background-color: ' + getBackgroundColor(cell.grass) + '";';
      }
      domRow += '>';
      domRow += '</div>';
    });
    domRow += '</div>';
    return domRow;
  }

  socket.on('connect', function() {
    $.ajax('/world').then(function(response) {
      var $board = $('#board');
      $board.html('');
      response.forEach(function addRow(row) {
        $board.append(buildRow(row));
      });
    });
  });
})();
