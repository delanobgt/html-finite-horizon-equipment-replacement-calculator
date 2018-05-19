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
        $('<th></th>').attr('colspan', 2).text('TC')
      ).appendTo($table);

      //add some rows to it
      for (let i = 0; i <= 3; i++) {
        if (i > 0) _makeInputRow().appendTo($table);
        _makeAddingRow().appendTo($table);
      }
    }

    function _makeInputRow() {
      let $newRemoveBtn = $('<input></input>').attr({type: 'button', value: 'X'});
      $newRemoveBtn.click(() => {
        let $inputRow = $newRemoveBtn.closest('tr');
        let $addingRow = $inputRow.next();
        $inputRow.remove();
        $addingRow.remove();
      });
      return  $('<tr></tr>').append(
                $('<td></td>').append(
                  $('<input></input>')
                    .attr({type: 'number', value: '0', placeholder: '0'}).prop('required', true)
                )
              ).append(
                $('<td></td>').append(
                  $newRemoveBtn
                )
              );
    }

    function _makeAddingRow() {
      let $addingRow =  $('<tr></tr>').append(
                          $('<td></td>').attr('colspan', 2)
                        );
      $addingRow.dblclick(() => {
        let $newInputRow = _makeInputRow().insertAfter($addingRow);
        _makeAddingRow().insertAfter($newInputRow);
      });
      return $addingRow;
    }

    function updateData(rows) {
      $table.empty();
    }

    return {
      updateData: updateData
    };
  }

  function bind(options) {
    return instance(options);
  }

  return {
    bind: bind
  };
})();
