let TcTableDOM = (function() {
  function instance(options) { 
    //jQuery object cache
    let $table;
    let $tbody;

    _init(options);
    function _init(options) {
      //assign reference to the table
      if (options.$table) $table = options.$table;
      else $table = $('#'+options.tableId);

      $table.addClass('siimple-table');

      //add a header
      $('<thead></thead>').addClass('siimple-table-header').append(
        $('<tr></tr>').addClass('siimple-table-row').append(
          $('<th></th>').addClass('siimple-table-cell').text('EoY')
        ).append(
          $('<th></th>').addClass('siimple-table-cell').html('Total Marginal<br>Cost <em>TC<sub>k</sub></em>')
        ).append(
          $('<th></th>').addClass('siimple-table-cell').text('')
        )
      ).appendTo($table);

      $tbody = $('<tbody></tbody>').addClass('siimple-table-body').appendTo($table);

      //add some rows to it
      for (let i = 0; i <= 3; i++) {
        if (i > 0) _makeInputRow()
                    .appendTo($tbody)
                    .showUp();
        _makeAddingRow()
          .appendTo($tbody)
          .showUp();
        _updateEoY();
      }
    }

    function _makeInputRow() {
      let $newTextbox = DecimalTextbox.manufacture()
                          .css({width: '330px'});
      let $newRemoveBtn = $('<div></div>')
                            .addClass('siimple-close')
                            .attr({type: 'button', value: 'X'})
                            .click(function() {
                              let $removableInputRow = $(this).closest('tr');
                              let $removableAddingRow = $removableInputRow.next();
                              $removableAddingRow.hideDown({remove: true});
                              $removableInputRow.hideDown({remove: true}, _updateEoY);
                            });
      let $newInputRow =  $('<tr></tr>').addClass('siimple-table-row').append(
                            $('<td></td>').addClass('siimple-table-cell')
                          ).append(
                            $('<td></td>').addClass('siimple-table-cell').append($newTextbox)
                          ).append(
                            $('<td></td>').addClass('siimple-table-cell').append($newRemoveBtn)
                          );
      $newInputRow.find('input').hide(0);
      return $newInputRow.hide(0);
    }

    function _makeAddingRow() {
      let $newAddingRow = $('<tr></tr>').addClass('siimple-table-row').append(
                            $('<td></td>')
                              .attr('colspan', 3)
                              .css({height: '0.25em'})
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
      return $newAddingRow.hide(0);
    }

    function _updateEoY() {
      $table.find('tbody tr:nth-child(even) td:nth-child(1)').each(function(index) {
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

    function feedWithJson(json) {
      $.when(
        $tbody.find('tr:nth-child(1) ~ tr').remove()
      ).then(() => {
        for (let row of json) {
          _makeInputRow()
            .appendTo($tbody)
            .show(0)
            .find('*').show(0);
          _makeAddingRow()
            .appendTo($tbody)
            .show(0)
            .find('*').show(0);
        }
        _updateEoY();
        $table.find('input[type="text"]').each(function(index) {
          $(this).val(json[index][0]);
        });
      })
    }

    //public-ly exposed function
    return {
      getTcList: getTcList,
      feedWithJson: feedWithJson
    };
  }

  function bind(options) {
    return instance(options);
  }

  return {
    bind: bind
  };
})();
