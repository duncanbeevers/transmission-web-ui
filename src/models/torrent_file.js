//= require <transmission>
//= require <torrent>
//= require <events>

Transmission.TorrentFile = (function() {
  var getTorrent = function() {
    return this.torrent;
  };
  
  var updateAttributes = function(new_attributes) {
    var new_attribute_value,
        callbacks = [];
    
    for (var attribute in new_attributes) {
      new_attribute_value = new_attributes[attribute];
      if (this.attributes[attribute] != new_attribute_value) {
        this.attributes[attribute] = new_attribute_value;
        if (this.attribute_callbacks[attribute]) {
          this.attribute_callbacks[attribute].each(function(callback) {
            if (!callbacks.include(callback)) {
              callbacks.push(callback);
            }
          });
        }
      }
    }
    
    callbacks.each(function(callback) { callback(); });
  };
  
  var addAttributeEventListener = function(attribute, callback) {
    if (!this.attribute_callbacks[attribute]) {
      this.attribute_callbacks[attribute] = [];
    }
    this.attribute_callbacks[attribute].push(callback);
  };
  
  var addAttributesEventListener = function(attributes, callback) {
    for (var i = attributes.length - 1; i >= 0; i--) {
      this.addAttributeEventListener(attributes[i], callback);
    }
  };
  
  var getAttribute = function(attribute) {
    return this.attributes[attribute];
  };
  
  var constructor = function(torrent) {
    this.torrent = torrent;
    this.attributes = {};
    
    this.attribute_callbacks = {};
  };
  
  constructor.prototype = {
    getTorrent: getTorrent,
    updateAttributes: updateAttributes,
    getAttribute: getAttribute,
    
    addAttributeEventListener: addAttributeEventListener,
    addAttributesEventListener: addAttributesEventListener
  };
  
  return constructor;
  
})();
