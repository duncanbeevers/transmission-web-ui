//= require <transmission>
//= require <events>

Transmission.Torrent = (function() {
  var getId = function() { return this.id; };
  
  var getFiles = function() { return this.files; };
  
  var updateAttributes = function(new_attributes) {
    this.attributes = Object.extend(this.attributes, new_attributes);
  };
  
  var getAttribute = function(attribute) {
    return this.attributes[attribute];
  };
  
  var constructor = function(id) {
    this.id = id;
    this.files = [];
    this.attributes = {};
  };
  
  constructor.prototype = {
    getId: getId,
    getFiles: getFiles,
    updateAttributes: updateAttributes,
    getAttribute: getAttribute
  };
  
  return constructor;
  
})();
