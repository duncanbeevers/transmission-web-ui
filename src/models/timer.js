/* Timer is similar to Prototype's PeriodicalExecuter, with a few notable differences
   First, a Timer does not begin firing when instantiated, but must be started with start()
   A Timer may be stopped, and then restarted later.
   A Timer's interval is specified in milliseconds instead of seconds
*/
Timer = (function() { return function(fn, initialInterval) {
  var work     = fn,
      interval = initialInterval,
      timer;
  return {
    interval: function() {
      return interval;
    },
    start: function() {
      work();
      timer = setInterval(work, interval);
    },
    stop: function() {
      if (timer) { clearInterval(timer); }
    }
  };
}; }());
