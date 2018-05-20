let TcTableDOM = (function() {
  function instance(options) { 
    //jQuery object cache
    let $table;
    
    // add custom jQuery plugin for show/hide functionality
    $.fn.showUp = function() {
      if (this.find('input').length) {
        let context = this;
        context.slideDown(0, () => context.find('input').slideDown());
        return context;
      } else {
        this.slideDown();
        return this;
      }
    };
    $.fn.hideDown = function(options) {
      if (this.find('input').length) {
        let context = this;
        let delay = (options && options.instant) ? 0 : 500;
        context.find('input').slideUp(delay, () => {
          context.slideUp(0, () => {
            if (options && options.remove) context.remove();
          });
        });
        return context;
      } else {
        let delay = (options && options.instant) ? 0 : 500;
        this.slideUp(delay, () => {
          if(options && options.remove) this.remove();
        });
        return this;
      }
    };

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
        if (i > 0) _makeInputRow()
                    .appendTo($table)
                    .showUp();
        _makeAddingRow()
          .appendTo($table)
          .showUp();
      }
    }

    function _makeInputRow() {
      let $newRemoveBtn = $('<input></input>').attr({type: 'button', value: 'X'});
      $newRemoveBtn.click(() => {
        let $removableInputRow = $newRemoveBtn.closest('tr');
        let $removableAddingRow = $removableInputRow.next();
        $removableInputRow.hideDown({remove: true});
        $removableAddingRow.hideDown({remove: true});
      });
      let $newTextbox = $('<input></input>')
                          .attr({type: 'text', value: '0', placeholder: '0'}).prop('required', true)
                          .on('input', function(e) {
                            let $this = $(this);
                            let val = $this.val()
                            //multiple decimal string filters
                            val = val.trim();
                            val = val.replace(/[^0-9\.]+/g, '');
                            while ((val.match(new RegExp('\\.', 'g')) || []).length > 1) {
                              let lastCommaIndex = val.lastIndexOf('.');
                              val = val.slice(0, lastCommaIndex) + val.slice(lastCommaIndex+1, val.length);
                            }
                            {
                              let matches = val.match(/^(0+).*/);
                              if (matches && matches[1]) {
                                if (matches[1].length > 1) {
                                  let leadingZeroLength = matches[1].length;
                                  val = val.slice(1, leadingZeroLength) + val.slice(leadingZeroLength, val.length);
                                } else if (val.charAt(1).match('[1-9]')) {
                                  val = val.slice(1, val.length);
                                }
                              }
                            }
                            $this.val(val);
                          })
                          .focusin(function() {
                            if ($(this).val().trim() === '0') $(this).val('');
                          })
                          .focusout(function() {
                            if ($(this).val().trim() === '') $(this).val('0');
                          });
      let $newInputRow =  $('<tr></tr>').append(
                            $('<td></td>').append(
                              $newTextbox
                            )
                          ).append(
                            $('<td></td>').append(
                              $newRemoveBtn
                            )
                          );
      return $newInputRow.hideDown({instant: true}).delay(200);
    }

    function _makeAddingRow() {
      let $newAddingRow = $('<tr></tr>').append(
                            $('<td></td>').attr('colspan', 2)
                          );
      $newAddingRow.dblclick(() => {
        let $newInputRow = _makeInputRow()
                            .insertAfter($newAddingRow)
                            .showUp();
        _makeAddingRow()
          .insertAfter($newInputRow)
          .showUp();
      });
      return $newAddingRow.hideDown({instant: true}).delay(200);
    }

    function getTcList() {
      let tcList = [];
      $table.find('input[type="text"]').each(function(index) {
        tcList.push(Number($(this).val()));
      });
      console.log(tcList);
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
