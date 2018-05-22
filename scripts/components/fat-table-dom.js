let FatTableDOM = (function() {
  function instance(options) { 
    //jQuery object cache
    let $table;
    let $marrText;

    _init(options);
    function _init(options) {
      //assign reference to the table
      if (options.$table) $table = options.$table;
      else $table = $('#'+options.tableId);
      if (options.$marrText) $marrText = options.$marrText;
      else $marrText = $('#'+options.marrTextId);

      //add a header
      $('<tr></tr>').append(
        $('<th></th>').html('EoY<br><em>k</em>')
      ).append(
        $('<th></th>').text('MV')
      ).append(
        $('<th></th>').html('Loss of MV<br>during year <em>k</em>')
      ).append(
        $('<th></th>').html('Cost of capital<br><em>i*MV<sub>k-1</sub></em>')
      ).append(
        $('<th></th>').html('Annual<br>expenses <em>E<sub>k</sub></em>')
      ).append(
        $('<th></th>').html('Total Marginal<br>Cost <em>TC<sub>k</sub></em>')
      ).append(
        $('<th></th>').html('&nbsp;')
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

      // give some contraints/exceptions to the table
      $table.find('tr:nth-child(2), tr:nth-child(2) td').delay(500).unbind();
      $table.find('tr:nth-child(3) td:nth-child(5) input').delay(500).remove();
      $table.find('tr:nth-child(3) td:nth-child(7) input').delay(500).remove();
      $table.find('tr:nth-child(3) td:nth-child(2) ~ td').delay(500).css('background', 'gray');

      //initialize table's values
      _updateTableValues();
    }

    function _makeInputRow() {
      let $newMvText = DecimalTextbox.manufacture(_updateComputableFields);
      let $newExpText = DecimalTextbox.manufacture(_updateComputableFields);
      let $newRemoveBtn = $('<input></input>')
                            .attr({type: 'button', value: 'X'})
                            .click(function() {
                              let $removableInputRow = $(this).closest('tr');
                              let $removableAddingRow = $removableInputRow.next();
                              $removableAddingRow.hideDown({remove: true});
                              $removableInputRow.hideDown({remove: true}, _updateTableValues);
                            });
      let $newInputRow =  $('<tr></tr>').append(
                            $('<td></td>').append($('<p></p>'))
                          ).append(
                            $('<td></td>').append($newMvText)
                          ).append(
                            $('<td></td>').append($('<p></p>'))
                          ).append(
                            $('<td></td>').append($('<p></p>'))
                          ).append(
                            $('<td></td>').append($newExpText)
                          ).append(
                            $('<td></td>').append($('<p></p>'))
                          ).append(
                            $('<td></td>').append($newRemoveBtn)
                          );
      return $newInputRow.hideDown({instant: true}).delay(30);
    }

    function _makeAddingRow() {
      let $newAddingRow = $('<tr></tr>').append(
                            $('<td></td>')
                              .attr('colspan', 7)
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
                              .showUp(_updateTableValues);
                          });
      return $newAddingRow.hideDown({instant: true}).delay(30);
    }

    function _updateTableValues() { 
      _updateEoY();
      _updateComputableFields();
    }

    function _updateEoY() {
      $table.find('tr:nth-child(2n-1) td:nth-child(1) p').each(function(index) {
        $(this).text(index);
      });
    }

    function _$get2DArray() {
      let $rows = [];
      $table.find('tr:nth-child(2) ~ tr:nth-child(odd)').each(function(index) {
        let $cols = [];
        let $gotColsTd = $(this).children();
        for (let i = 0; i < $gotColsTd.length; i++) {
          $cols.push($($($gotColsTd[i]).children()[0]));
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
        let expense = Number(__.toNumber($rows[i][4].val()));
        let TC = lossMV + costCapital + expense;
        $rows[i][2].text(__.formatGeneralCurrency(lossMV));
        $rows[i][3].text(__.formatGeneralCurrency(costCapital));
        $rows[i][5].text(__.formatGeneralCurrency(TC));
      }
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
