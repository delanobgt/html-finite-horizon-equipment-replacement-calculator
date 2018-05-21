let DecimalTextbox = (function() {
  function manufacture(callback) {
    return  $('<input></input>')
              .attr({type: 'text', value: '0', placeholder: '0'}).prop('required', true)
              .on('input', function(e) {
                let $this = $(this);
                let val = $this.val();
                //multiple decimal string filters
                val = val.trim();
                val = val.replace(/[^0-9\.]+/g, '');
                //initial status
                let hasTailDot = (val.indexOf('.') == val.length-1);
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
                $this.val(__.formatGeneralCurrency(val) + (hasTailDot?'.':''));
                if (callback) callback();
              })
              .focusin(function() {
                if ($(this).val().trim() === '0') $(this).val('');
              })
              .focusout(function() {
                if ($(this).val().trim() === '') $(this).val('0');
              });
  }

  return {
    manufacture: manufacture
  };
})();