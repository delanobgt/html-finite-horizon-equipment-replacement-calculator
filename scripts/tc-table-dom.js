let TcTableDOM = (function() {
  function instance(options) { 
    //jQuery object cache
    let $table;
    
    // add custom jQuery plugin for show/hide functionality
    $.fn.showUp = function(callback) {
      let delay = 80;
      if (this.find('input').length) {
        let context = this;
        if (callback) context.slideDown(0, () => context.find('input').slideDown(delay, callback));
        else context.slideDown(0, () => context.find('input').slideDown(delay));
        return context;
      } else {
        if (callback) this.slideDown(delay, callback);
        else this.slideDown(delay);
        return this;
      }
    };
    $.fn.hideDown = function(options, callback) {
      let delay = 80;
      let context = this;
      if (this.find('input').length) { // for textboxes
        let curDelay = (options && options.instant) ? 0 : delay;
        this.find('input').slideUp(curDelay, function() {
          context.slideUp(0, function() {
            if (options && options.remove) {
              if (callback) $.when(context.remove()).then(callback());
              else context.remove();
            }
          });
        });
        return context;
      } else {  // for adding rows
        let curDelay = (options && options.instant) ? 0 : 50;
        this.slideUp(curDelay, () => {
          if(options && options.remove) {
            if (callback) $.when(this.remove()).then(callback());
            else this.remove();
          }
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
        $('<th></th>').text('EoY')
      ).append(
        $('<th></th>').text('TC') 
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
