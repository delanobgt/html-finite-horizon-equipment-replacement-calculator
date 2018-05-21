let DecimalTextbox = (function() {
  function _applyBehaviorTo($node, callback) {
    return  $node
              .attr({type: 'text', value: '0'})
              .prop('required', true)
              .on('input', function(e) {
                let $this = $(this);
                let val = $this.val();
                //multiple decimal string filters
                if (val === '.') val = '0.';
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
                if (callback) callback();
              })
              .focusin(function() {
                if ($(this).val().trim() === '0') $(this).val('');
              })
              .focusout(function() {
                if ($(this).val().trim() === '') $(this).val('0');
              });
  }

  function bind(options) {
    if (options.id) _applyBehaviorTo($('#'+options.id));
    else if (options.id && options.callback) _applyBehaviorTo($('#'+options.id), options.callback);
    else if (options.$object) _applyBehaviorTo($(options.$object));
    else if (options.$object && options.callback) _applyBehaviorTo($(options.$object), options.callback);
  }

  function manufacture(callback) {
    return _applyBehaviorTo($('<input></input>'), callback);     
  }

  return {
    bind: bind,
    manufacture: manufacture
  };
})();