(function() {
  'use strict';

  var socket = io();

  console.log('setting up listener ' + socket.id);
  socket.on('tick', function(msg) {
    console.log('ticked: ' + msg);
    $('#tick').html(msg);
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
