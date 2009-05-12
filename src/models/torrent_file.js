//= require <transmission>
//= require <torrent>
//= require <events>

Transmission.TorrentFile = (function() {
  var getTorrent = function() {
    return this.torrent;
  };
  
  var updateAttributes = function(new_attributes) {
    this.attributes = Object.extend(this.attributes, new_attributes);
  };
  
  var getAttribute = function(attribute) {
    return this.attributes[attribute];
  };
  
  var constructor = function(torrent) {
    this.torrent = torrent;
    this.attributes = {};
  };
  
  constructor.prototype = {
    getTorrent: getTorrent,
    updateAttributes: updateAttributes,
    getAttribute: getAttribute
  };
  
  return constructor;
  
})();
