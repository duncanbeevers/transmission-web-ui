//= require <transmission>

/**
  When a class needs to register event listeners it returns
  an object which protypically-extends EventDispatcher,
  allowing callbacks for specific event types to be registered
  on the instance.
  
  Event dispatch itself should be invoked within the instance.
**/
Transmission.EventDispatcher = (function() {
  var callbacks = {};
  
  return {
    dispatchEvent: function(event) {
      (callbacks[event.getType()] || []).each(function(callback) {
        callback(event);
      });
    },
    addEventListener: function(event_type, callback) {
      var t = event_type.getType();
      if (!callbacks[t]) { callbacks[t] = []; }
      callbacks[t].push(callback);
    }
  };
} ());

/**
  Conveniently construct a namespace of events
  
    Transmission.TorrentEvents = Transmission.Events('TorrentAdded', 'TorrentRemoved');
    event = new Transmission.TorrentEvents.TorrentAdded('data');
    
    event.getData() -> 'data'
    event.getType() -> 'TorrentAdded'
    
**/
Transmission.Events = (function() {
  var o = {};
  for (var i = arguments.length - 1; i >= 0; i--) {
    o[arguments[i]] = new Transmission.EventType(arguments[i]);
  }
  return o;
});

/**
  An EventType constructor which encapsulates the name of the type
  and makes it available through a method on the created EventType
  itself as well as its instances.
  
**/
Transmission.EventType = (function() { return function(type) {
  var c = function(data) {
    return {
      getType: function() { return type; },
      getData: function() { return data; }
    }
  };
  c.getType = function() { return type; }
  
  return c;
}; }());
