let TcTableDOM = (function() {
  function instance(options) { 
    //jQuery object cache
    let $table;

    _init(options);
    function _init(options) {
      //assign reference to the table
      if (options.$table) $table = options.$table;
      else $table = $('#'+options.tableId);

      //add a header
      $('<tr></tr>').append(
        $('<th></th>').text('EoY')
      ).append(
        $('<th></th>').html('Total Marginal<br>Cost <em>TC<sub>k</sub></em>')
      ).append(
        $('<th></th>').text('')
      ).appendTo($table);

      //add some rows to it
      for (let i = 0; i <= 3; i++) {
        if (i > 0) _makeInputRow()
                    .appendTo($table)
                    .showUp();
        _makeAddingRow()
          .appendTo($table)
          .showUp();
        _updateEoY();
      }
    }

    function _makeInputRow() {
      let $newTextbox = DecimalTextbox.manufacture();
      let $newRemoveBtn = $('<input></input>')
                            .attr({type: 'button', value: 'X'})
                            .click(function() {
                              let $removableInputRow = $(this).closest('tr');
                              let $removableAddingRow = $removableInputRow.next();
                              $removableAddingRow.hideDown({remove: true});
                              $removableInputRow.hideDown({remove: true}, _updateEoY);
                            });
      let $newInputRow =  $('<tr></tr>').append(
                            $('<td></td>')
                          ).append(
                            $('<td></td>').append(
                              $newTextbox
                            )
                          ).append(
                            $('<td></td>').append(
                              $newRemoveBtn
                            )
                          );
      return $newInputRow.hideDown({instant: true}).delay(30);
    }

    function _makeAddingRow() {
      let $newAddingRow = $('<tr></tr>').append(
                            $('<td></td>')
                              .attr('colspan', 3)
                              .mouseenter(function() {
                                $(this).css({background: 'blue'});
                              }).mouseleave(function() {
                                $(this).css({background: 'lightgray'});
                              })
                          ).mousedown(function() {
                            let $newInputRow = _makeInputRow()
                                                .insertAfter($(this))
                                                .showUp();
                            _makeAddingRow()
                              .insertAfter($newInputRow)
                              .showUp(_updateEoY);
                          });
      return $newAddingRow.hideDown({instant: true}).delay(30);
    }

    function _updateEoY() {
      $table.find('tr:nth-child(2n-1) td:nth-child(1)').each(function(index) {
        $(this).text(index);
      });
    }

    function getTcList() {
      let tcList = [];
      $table.find('input[type="text"]').each(function(index) {
        tcList.push(Number($(this).val()));
      });
      return tcList;
    }

    //public-ly exposed function
    return {
      getTcList: getTcList
    };
  }

  function bind(options) {
    return instance(options);
  }

  return {
    bind: bind
  };
})();
