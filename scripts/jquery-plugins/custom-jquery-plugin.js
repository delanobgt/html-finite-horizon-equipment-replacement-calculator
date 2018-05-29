// add custom jQuery plugin for show/hide functionality
$.fn.showUp = function(callback) {
  let delay = 150;
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
  let delay = 30;
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
    let curDelay = (options && options.instant) ? 0 : delay;
    this.slideUp(curDelay, () => {
      if(options && options.remove) {
        if (callback) $.when(this.remove()).then(callback());
        else this.remove();
      }
    });
    return this;
  }
};