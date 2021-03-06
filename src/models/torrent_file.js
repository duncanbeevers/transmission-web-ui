//= require <transmission>
//= require <torrent>
//= require <events>

Transmission.TorrentFile = (function() {
  var getTorrent = function() {
    return this.torrent;
  };
  
  var constructor = function(torrent) {
    this.torrent = torrent;
  };
  
  constructor.prototype = Transmission.extend(Transmission.AttributeEventDispatcher.prototype, {
    getTorrent: getTorrent
  });
  
  return constructor;
  
})();
