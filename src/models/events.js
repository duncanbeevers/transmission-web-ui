//= require <transmission>

Transmission.EventDispatcher = (function() {
  var callbacks = {};
  
  return {
    dispatchEvent: function(event) {
      (callbacks[event.type()] || []).forEach(function(callback) {
        callback(event);
      });
    },
    addEventListener: function(event_type, callback) {
      var t = event_type.type();
      if (!callbacks[t]) { callbacks[t] = []; }
      callbacks[t].push(callback);
    }
  };
} ());

Transmission.Events = (function() {
  var o = {};
  for (var i = arguments.length - 1; i >= 0; i--) {
    o[arguments[i]] = new Transmission.EventType(arguments[i]);
  }
  return o;
});

Transmission.EventType = (function() { return function(type) {
  var c = function(data) {
    return {
      type: function() { return type; },
      getData: function() { return data; }
    }
  };
  c.type = function() { return type; }
  
  return c;
}; }());
