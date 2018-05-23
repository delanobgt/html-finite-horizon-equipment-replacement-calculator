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
      $table =  $('<table></table>');
      if (options.tableType === 'tc') tableDOM = TcTableDOM.bind({$table: $table});
      else if (options.tableType === 'fat') tableDOM = FatTableDOM.bind({
        $table: $table, 
        marrTextId: options.marrTextId
      });
      if (options.wrapperDivId) $wrapperDiv = $('#'+wrapperDivId);
      else if (options.$wrapperDiv) $wrapperDiv = options.$wrapperDiv;

      $wrapperDiv.css({display: 'inline-block'});
      $spanTitle =  $('<span></span>')
                      .css({background: 'rgb(175, 245, 220)', fontWeight: 'bold'})  
                      .css({display: 'inline-block', width: '150px', fontSize: '1.7em'})
                      .addClass('siimple-code siimple-tip siimple-tip--navy')
                      .text(' as');
      $inputTitle = $('<input>')
                      .addClass('siimple-input')
                      .attr({type: 'text'})
                      .css({display: 'none', width: '150px', fontSize: '1.7em', fontWeight: 'bold'})
                      .on('input', function(e) {
                        let $this = $(this);
                        let val = $this.val();
                        while (val.length > 12)
                          val = val.slice(0, -1);
                        $this.val(val);
                      }).focusin(function() {
                        $spanTitle.hide(0);
                        $inputTitle.val($spanTitle.text().trim());
                      }).focusout(function() {
                        if ($inputTitle.val().trim() !== '')
                          $spanTitle.text($inputTitle.val().trim());
                        $spanTitle.show(0);
                        $inputTitle.val('');
                        $inputTitle.hide(0);
                      }).keydown(function(e) {
                        if (e.keyCode == 13) {
                          $inputTitle.focusout();
                        }
                    });
      $btnEditTitle = $('<img>')
                        .attr({src: 'res/icons8-pencil-25.png', type: 'button', value: 'Edit'})
                        .css({cursor: 'pointer'})
                        .click(function() {
                          $inputTitle.show(0);
                          $inputTitle.focusin();
                          $inputTitle.focus();
                        });
      $btnClose = $('<input>')
                    .addClass('siimple-btn siimple-btn--red')
                    .attr({type: 'button', value: 'X'})
                    .click(function() {
                      $wrapperDiv.parent().remove();
                      alive = false;
                      if (options.closeCallback) options.closeCallback();
                    });

      $wrapperDiv.css({padding: '1em 0'}).append(
        $('<div></div>').addClass('siimple-grid').append(
          $('<div></div>').addClass('siimple-grid-row').append( //header div
            $('<div></div>')
              .addClass('siimple-grid-col siimple-grid-col--2')
              .html('&nbsp')
          ).append(
            $('<div></div>')
              .addClass('siimple-grid-col siimple-grid-col--8')
              .css({display: 'block'}).append(
                $spanTitle
              ).append(
                $inputTitle
              ).append(
                $btnEditTitle
              )
          ).append(
            $('<div></div>')
              .addClass('siimple-grid-col siimple-grid-col--2')
              .append(
                $btnClose.css({float: 'right'})
              )
          )
        )
      ).append(
        $table
      );
    }

    return {
      $DOM: $('<div></div>')
              .css({textAlign: 'center'})
              .append($wrapperDiv),
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