let FatTableDOM = (function() {
  function instance(options) { 
    //jQuery object cache
    let $table;
    let $tbody;
    let $marrText;

    _init(options);
    function _init(options) {
      //assign reference to the table
      if (options.$table) $table = options.$table;
      else $table = $('#'+options.tableId);
      if (options.$marrText) $marrText = options.$marrText;
      else $marrText = $('#'+options.marrTextId);

      $table.addClass('siimple-table');
      
      //add a header
      $('<thead></thead>').addClass('siimple-table-header').append(
        $('<tr></tr>').addClass('siimple-table-row').append(
          $('<th></th>').addClass('siimple-table-cell').html('EoY<br><em>k</em>')
        ).append(
          $('<th></th>').addClass('siimple-table-cell').text('MV')
        ).append(
          $('<th></th>').addClass('siimple-table-cell').html('Loss of MV<br>during year <em>k</em>')
        ).append(
          $('<th></th>').addClass('siimple-table-cell').html('Cost of capital<br><em>i*MV<sub>k-1</sub></em>')
        ).append(
          $('<th></th>').addClass('siimple-table-cell').html('Annual<br>expenses <em>E<sub>k</sub></em>')
        ).append(
          $('<th></th>').addClass('siimple-table-cell').html('Total Marginal<br>Cost <em>TC<sub>k</sub></em>')
        ).append(
          $('<th></th>').addClass('siimple-table-cell').html('&nbsp;')
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

      // give some contraints/exceptions to the table
      $table.find('tbody tr:nth-child(1)').delay(250).unbind();
      $table.find('tbody tr:nth-child(2) td:nth-child(5) input').delay(250).remove();
      $table.find('tbody tr:nth-child(2) td:nth-child(7) div').delay(250).remove();
      $table.find('tbody tr:nth-child(2) td:nth-child(2) ~ td').delay(250).css('background', 'lightgray');

      //initialize table's values
      _updateTableValues();
    }

    function _makeInputRow() {
      let $newMvText = DecimalTextbox.manufacture(_updateComputableFields);
      let $newExpText = DecimalTextbox.manufacture(_updateComputableFields);
      let $newRemoveBtn = $('<div></div>')
                            .addClass('siimple-close')
                            .attr({type: 'button', value: 'X'})
                            .click(function() {
                              let $removableInputRow = $(this).closest('tr');
                              let $removableAddingRow = $removableInputRow.next();
                              $removableAddingRow.hideDown({remove: true});
                              $removableInputRow.hideDown({remove: true}, _updateTableValues);
                            });
      let $newInputRow =  $('<tr></tr>').addClass('siimple-table-row').append(
                            $('<td></td>').addClass('siimple-table-cell')
                          ).append(
                            $('<td></td>').addClass('siimple-table-cell').append($newMvText)
                          ).append(
                            $('<td></td>').addClass('siimple-table-cell')
                          ).append(
                            $('<td></td>').addClass('siimple-table-cell')
                          ).append(
                            $('<td></td>').addClass('siimple-table-cell').append($newExpText)
                          ).append(
                            $('<td></td>').addClass('siimple-table-cell')
                          ).append(
                            $('<td></td>').addClass('siimple-table-cell').append($newRemoveBtn)
                          );
      return $newInputRow.hideDown({instant: true}).delay(30);
    }

    function _makeAddingRow() {
      let $newAddingRow = $('<tr></tr>').addClass('siimple-table-row').append(
                            $('<td></td>')
                              .attr('colspan', 7)
                              .css({height: '0.25em'})
                          ).mouseenter(function() {
                            $(this).css({background: 'blue'});
                          }).mouseleave(function() {
                            $(this).css({background: 'lightgray'});
                          }).mousedown(function() {
                            let $newInputRow = _makeInputRow()
                                                .insertAfter($(this))
                                                .showUp();
                            _makeAddingRow()
                              .insertAfter($newInputRow)
                              .showUp(_updateTableValues);
                          });
      return $newAddingRow.hideDown({instant: true}).delay(30);
    }

    function _updateTableValues() { 
      _updateEoY();
      _updateComputableFields();
    }

    function _updateEoY() {
      $table.find('tbody tr:nth-child(even) td:nth-child(1)').each(function(index) {
        $(this).text(index);
      });
    }

    function _$get2DArray() {
      let $rows = [];
      $table.find('tbody tr:nth-child(even)').each(function(index) {
        let $cols = [];
        let $gotColsTd = $(this).children();
        for (let i = 0; i < $gotColsTd.length; i++) {
          if ($($gotColsTd[i]).children().length == 0) {
            $cols.push($($gotColsTd[i]));
          } else {
            $cols.push($($($gotColsTd[i]).children()[0]));
          }
          
        }
        $rows.push($cols);
      });
      return $rows;
    }

    function _updateComputableFields() {
      let MARR = Number($marrText.val());
      let $rows = _$get2DArray();
      for (let i = 1; i < $rows.length; i++) {
        let prevMV = Number($rows[i-1][1].val());
        let curMV = Number($rows[i][1].val());
        let lossMV = prevMV-curMV;
        let costCapital = (MARR/100.0)*prevMV;
        let expense = __.toNumber($rows[i][4].val());
        let TC = lossMV + costCapital + expense;
        $rows[i][2].text(__.formatGeneralCurrency(lossMV));
        $rows[i][3].text(__.formatGeneralCurrency(costCapital));
        $rows[i][5].text(__.formatGeneralCurrency(TC));
      }
    }

    function getTcList() {
      let tcList = [];
      $table.find('tbody tr td:nth-child(6)').each(function(index) {
        tcList.push(__.toNumber($(this).text()));
      });
      tcList.shift();
      return tcList;
    }

    //public-ly exposed function
    return {
      getTcList: getTcList,
      updateTableValues: _updateTableValues
    };
  }

  function bind(options) {
    return instance(options);
  }

  return {
    bind: bind
  };
})();
