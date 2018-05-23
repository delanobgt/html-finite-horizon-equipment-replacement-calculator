let AddEntityButton = (function() {

  function bind(options) {
    $('#'+options.buttonId)
      .css({display: 'flex', flexDirection: 'row', cursor: 'pointer'})
      .append(
        $('<span></span>')
          .css({display: 'flex', width: '50%', height: '50px', background: 'cyan', justifyContent: 'center', alignItems: 'center'})
          .text('Using TC values')
          .click(function() {
            if (options.type === 'defender') {
              if (options.globals.defender === null) {
                let newEntity = Entity.$manufacture({
                  tableType: 'tc',
                  closeCallback: function() { 
                    options.globals.defender = null; 
                    $('#'+options.buttonId).fadeIn();
                  }
                });
                options.globals.defender = newEntity;
                newEntity.$DOM.appendTo($('#'+options.containerId));
                $('#'+options.buttonId).fadeOut();
              }
            } else if (options.type === 'challenger') {
              let newEntity = Entity.$manufacture({tableType: 'tc'});
              options.globals.challengers.push(newEntity);
              newEntity.$DOM.appendTo($('#'+options.containerId));
            }
          })
      ).append(
        $('<span></span>')
          .css({display: 'flex', width: '50%', height: '50px', background: 'yellow', justifyContent: 'center', alignItems: 'center'})
          .text('Using MV & Expenses value')
          .click(function() {
            if (options.type === 'defender') {
              if (options.globals.defender === null) {
                let newEntity = Entity.$manufacture({
                  tableType: 'fat',
                  marrTextId: 'marr_text',
                  closeCallback: function() { 
                    options.globals.defender = null;
                    $('#'+options.buttonId).fadeIn();
                  }
                });
                options.globals.defender = newEntity;
                newEntity.$DOM.appendTo($('#'+options.containerId));
                $('#'+options.buttonId).fadeOut();
              }
            } else if (options.type === 'challenger') {
              let newEntity = Entity.$manufacture({tableType: 'fat', marrTextId: 'marr_text'});
              options.globals.challengers.push(newEntity);
              newEntity.$DOM.appendTo($('#'+options.containerId));
            }
          })
      );
  }

  return {
    bind: bind
  };
})();