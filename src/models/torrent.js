//= require <transmission>
//= require <events>

Transmission.Torrent = (function() { return function(id) {
  var files = [];
  var attributes = {};
  
  var getId = function() { return id; };
  var getFiles = function() { return files; };
  
  var updateAttributes = function(new_attributes) {
    attributes = Object.extend(attributes, new_attributes);
  };
  var getAttribute = function(attribute) {
    return attributes[attribute];
  };
  
  return {
    getId: getId,
    getFiles: getFiles,
    updateAttributes: updateAttributes,
    getAttribute: getAttribute
  };
}; })();
