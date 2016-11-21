(function() {
  'use strict';

  var socket = io();

  socket.on('tick', function(worldChanges) {
    worldChanges.forEach(function(change) {
      var row = $($('#board').children()[change.x]);
      $(row.children()[change.y]).css('background-color', getBackgroundColor(change.grass.state));
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
      if (cell.grass.state) {
        domRow += 'style="background-color: ' + getBackgroundColor(cell.grass.state) + '";';
      }
      domRow += '></div>';
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
