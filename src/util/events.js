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
  When a class need to register event listeners on specific attributes of
  itself, and to expose its attributes through an observable interface,
  it prototypically-extends AttributeEventDispatcher,
  allowing callbacks to be registered observing changes to specific
  attributes or groups of attributes of the instance.
  
  Event dispatch is triggered through the updateAttributes interface of the instance.
**/
Transmission.AttributeEventDispatcher = (function() {
  var addAttributeEventListener = function(attribute, callback) {
    if (!this.attribute_event_callbacks[attribute]) {
      this.attribute_event_callbacks[attribute] = [];
    }
    this.attribute_event_callbacks[attribute].push(callback);
  };
  
  var addAttributesEventListener = function(attributes, callback) {
    for (var i = attributes.length - 1; i >= 0; i--) {
      this.addAttributeEventListener(attributes[i], callback);
    }
  };
  
  var updateAttributes = function(attributes) {
    var attribute_value,
        callbacks = [];
    
    for (var attribute in attributes) {
      attribute_value = attributes[attribute];
      if (this.attributes[attribute] != attribute_value) {
        this.attributes[attribute] = attribute_value;
        if (this.attribute_event_callbacks[attribute]) {
          this.attribute_event_callbacks[attribute].each(function(callback) {
            if (!callbacks.include(callback)) {
              callbacks.push(callback);
            }
          });
        }
      }
    }
    
    callbacks.each(function(callback) { callback(); });
  };
  
  var getAttribute = function(attribute) {
    return this.attributes[attribute];
  };
  
  var constructor = function() {
    this.attributes = {};
    this.attribute_event_callbacks = {};
  };
  
  constructor.prototype = {
    updateAttributes: updateAttributes,
    getAttribute: getAttribute,
    addAttributeEventListener: addAttributeEventListener,
    addAttributesEventListener: addAttributesEventListener
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
