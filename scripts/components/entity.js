let Entity = (function() {
  function $instance(options) {
    let $wrapperDiv;
    let $spanTitle;
    let $inputTitle;
    let $btnEditTitle;
    let $btnClose;
    let $table;
    let tableDOM;
    
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
                      .css({display: 'none', width: '100px'});
      $btnEditTitle = $('<input>')
                        .attr({type: 'button', value: 'Edit'})
                        .click(function() {
                          $spanTitle.toggle();
                          $inputTitle.toggle();
                        });
      $btnClose = $('<input>')
                    .attr({type: 'button', value: 'X'})
                    .click(function() {
                      $wrapperDiv.remove();
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
      API: null
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