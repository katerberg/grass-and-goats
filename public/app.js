(function() {
  'use strict';

  var socket = io();

  socket.on('tick', function(worldChanges) {
    worldChanges.goats.forEach(function(goat) {
      if (goat.formerPosition.x) {
        console.log(goat.formerPosition.x);
        console.log(goat.formerPosition.y);
        var row = $($('#board').children()[goat.formerPosition.x]);
        $(row.children()[goat.formerPosition.y]).css('background-color', 'rgb(255,255,255)');
      }
    });
    worldChanges.grass.forEach(function(cellChange) {
      var row = $($('#board').children()[cellChange.x]);
      $(row.children()[cellChange.y]).css('background-color', getBackgroundColor(cellChange.grass));
    });
    worldChanges.goats.forEach(function(goat) {
      console.log('goat moving to ' + goat.position.x + ',' + goat.position.y);
      var row = $($('#board').children()[goat.position.x]);
      $(row.children()[goat.position.y]).css('background-color', 'rgb(255,0,0)');
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
