let IntegerTextbox = (function() {
  function _applyBehaviorTo($node, options) {
    return  $node
              .attr({type: 'text', value: '0'})
              .prop('required', true)
              .on('input', function(e) {
                let $this = $(this);
                let val = $this.val();
                //multiple decimal string filters
                val = val.trim();
                val = val.replace(/[^0-9]+/g, '');
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
                if (options.maxValue) {
                  while (Number(val) > options.maxValue)
                    val = val.slice(0, -1);
                }
                $this.val(val);
                if (options.callback) options.callback();
              })
              .focusin(function() {
                if ($(this).val().trim() === '0') $(this).val('');
              })
              .focusout(function() {
                if ($(this).val().trim() === '') $(this).val('0');
              });
  }

  function bind(options) {
    if (options.id) _applyBehaviorTo($('#'+options.id), options);
    else if (options.$object) _applyBehaviorTo($(options.$object), options);
  }

  function manufacture(options) {
    return _applyBehaviorTo($('<input></input>'), options || {});
  }

  return {
    bind: bind,
    manufacture: manufacture
  };
})();