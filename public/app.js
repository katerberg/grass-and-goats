(function() {
  'use strict';

  var socket = io();

  console.log('setting up listener ' + socket.id);
  socket.on('tick', function(worldChanges) {
    worldChanges.forEach(function(change) {
      var row = $($('#board').children()[change.x]);
      $(row.children()[change.y]).css('background-color', getBackgroundColor(change.grass));
    });
  });
  
  function getBackgroundColor(grass) {
    var depth = 255 * Math.abs(1 - grass);
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
      domRow += '></div>';
    });
    domRow += '</div>';
    return domRow;
  }

  $.ajax('/world').then(function(response) {
    var $board = $('#board');
    response.forEach(function addRow(row) {
      $board.append(buildRow(row));
    });
  });
})();
