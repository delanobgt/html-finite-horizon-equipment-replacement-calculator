let Entity = (function() {
  function $instance(options) {
    let $wrapperDiv;
    let $spanTitle;
    let $inputTitle;
    let $btnEditTitle;
    let $btnClose;
    let $table;
    let tableDOM;
    let alive = true;
    
    _init(options);
    function _init(options) {
      $table = $('<table></table>');
      if (options.tableType === 'tc') tableDOM = TcTableDOM.bind({$table: $table});
      else if (options.tableType === 'fat') tableDOM = FatTableDOM.bind({
        $table: $table, 
        marrTextId: options.marrTextId
      });
      if (options.wrapperDivId) $wrapperDiv = $('#'+wrapperDivId);
      else if (options.$wrapperDiv) $wrapperDiv = options.$wrapperDiv;

      $wrapperDiv.css({display: 'inline-block'});
      $spanTitle =  $('<span></span>')
                      .text('lol')
                      .css({display: 'inline-block', width: '100px'});
      $inputTitle = $('<input>')
                      .attr({type: 'text'})
                      .css({display: 'none', width: '100px'})
                      .focusin(function() {
                        $spanTitle.hide(0);
                        $inputTitle.val($spanTitle.text());
                      }).focusout(function() {
                        if ($inputTitle.val() !== '')
                          $spanTitle.text($inputTitle.val());
                        $spanTitle.show(0);
                        $inputTitle.val('');
                        $inputTitle.hide(0);
                      }).keydown(function(e) {
                        if (e.keyCode == 13) {
                          $inputTitle.focusout();
                        }
                    });
      $btnEditTitle = $('<input>')
                        .attr({type: 'button', value: 'Edit'})
                        .click(function() {
                          $inputTitle.show(0);
                          $inputTitle.focusin();
                          $inputTitle.focus();
                        });
      $btnClose = $('<input>')
                    .attr({type: 'button', value: 'X'})
                    .click(function() {
                      $wrapperDiv.remove();
                      alive = false;
                      if (options.closeCallback) options.closeCallback();
                    });

      $wrapperDiv.append(
        $('<div></div>').append( //header div
          $spanTitle
        ).append(
          $inputTitle
        ).append(
          $btnEditTitle
        ).append(
          $btnClose.css({float: 'right'})
        )
      ).append(
        $table
      );
    }

    return {
      $DOM: $wrapperDiv,
      isAlive: () => alive,
      getTitle: () => $spanTitle.text(),
      tableDOM: tableDOM
    };
  }

  function bind(options) {
    return instance(options);
  }
  function $manufacture(options) {
    options.$wrapperDiv = $('<div></div>');
    return $instance(options);
  }
  return {
    bind: bind,
    $manufacture: $manufacture
  };
})();