//= require <transmission>

/* Timer is similar to Prototype's PeriodicalExecuter, with a few notable differences
   First, a Timer does not begin firing when instantiated, but must be started with start()
   A Timer may be stopped, and then restarted later.
   A Timer's interval is specified in milliseconds instead of seconds
*/
Transmission.Timer = (function() {
  var getInterval = function() {
    return this.interval;
  };
  
  var start = function() {
    if (this.timer) { return; }
    this.work();
    this.timer = setInterval(this.work, this.interval);
  };
  
  var stop = function() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  var constructor = function(fn, initialInterval) {
    this.work     = fn;
    this.interval = initialInterval;
    this.timer    = null;
  };
  
  constructor.prototype = {
    getInterval: getInterval,
    start: start,
    stop: stop
  };
  
  return constructor;
})();
