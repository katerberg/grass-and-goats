(function() {
  'use strict';

  var socket = io();

  console.log('setting up listener ' + socket.id);
  socket.on('tick', function(worldChanges) {
    console.log('ticked');
    worldChanges.forEach(function(change) {
      var row = $($('#board').children()[change.x]);
      $(row.children()[change.y]).addClass('green');
    });
    if (worldChanges) {
      console.log(worldChanges);
    }
  });

  function buildRow(row) {
    var domRow = '<div class="row">';
    row.forEach(function(cell) {
      domRow += '<div class="cell';
      if (cell.grass) {
        domRow += ' green';
      }
      domRow += '"></div>';
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
