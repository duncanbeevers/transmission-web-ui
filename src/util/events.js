//= require <transmission>

/**
  When a class needs to register event listeners it returns
  an object which protypically-extends EventDispatcher,
  allowing callbacks for specific event types to be registered
  on the instance.
  
  Event dispatch itself should be invoked within the instance.
**/
Transmission.EventDispatcher = (function() {
  var constructor =  function() {
    this.initialize();
  };
  
  constructor.prototype = {
    initialize: function() {
      this.event_callbacks = {};
    },
    dispatchEvent: function(event) {
      (this.event_callbacks[event.getType()] || []).each(function(callback) {
        callback.defer(event);
      });
    },
    addEventListener: function(event_type, callback) {
      var t = event_type.getType();
      
      if (!this.event_callbacks[t]) { this.event_callbacks[t] = []; }
      this.event_callbacks[t].push(callback);
    }
  };
  
  return constructor;
})();

/**
  Conveniently construct a namespace of events
  
    Transmission.TorrentEvents = Transmission.Events('TorrentAdded', 'TorrentRemoved');
    event = new Transmission.TorrentEvents.TorrentAdded('data');
    
    event.getData() -> 'data'
    event.getName() -> 'TorrentAdded'
    event.getType() -> An opaque integer unique to this event class
    
**/
Transmission.Events = (function() {
  var o = {};
  for (var i = arguments.length - 1; i >= 0; i--) {
    o[arguments[i]] = Transmission.EventType(arguments[i]);
  }
  return o;
});

/**
  An EventType constructor which encapsulates the name of the type
  and makes it available through a method on the created EventType
  itself as well as its instances.
  
**/
Transmission.EventType = (function() {
  var events_count = 0;
return function(name) {
  var type = events_count++,
      getType = function() { return type; },
      getName = function() { return name; },
      c = function(data) {
        return {
          getData: function() { return data; },
          getType: getType,
          getName: getName
        };
      };
  c.getType = getType;
  c.getName = getName;
  
  return c;
}; })();
