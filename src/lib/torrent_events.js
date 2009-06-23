//= require <transmission>
//= require <events>

Transmission.TorrentEventDispatcher = (function() {
  var initialize = function(o) {
    if (!o.torrents_callbacks) { o.torrents_callbacks = {}; }
  };
  
  var dispatchTorrentEvent = function(event) {
    initialize(this);
    var data = event.getData().torrent_data,
        torrent_callbacks = this.torrents_callbacks[data.id];
    if (!torrent_callbacks) { return; }
    
    var callback_groups = this.torrents_callbacks[event.getType()];
    if (!callback_groups) { return; }
    
    for (var id in callback_groups) {
      var callbacks = callback_groups[id];
      for (var i = 0, len = callbacks.length; i < len; i++) {
        callbacks[i](event);
      }
    }
  };
  
  var addTorrentEventListener = function(event_type, torrent_id, callback) {
    initialize(this);
    var t = event_type.getType();
    if (!this.torrents_callbacks[torrent_id]) {
      this.torrents_callbacks[torrent_id] = {};
    }
    if (!this.torrents_callbacks[torrent_id][t]) {
      this.torrents_callbacks[torrent_id][t] = [];
    }
    this.torrents_callbacks[torrent_id][t].push(callback);
  };
  
  var removeTorrentEventListener = function(event_type, torrent_id, callback) {
    initialize(this);
    if (!this.torrents_callbacks[torrent_id]) { return; }
    var t = event_type.getType();
    if (!this.torrents_callbacks[torrent_id][t]) { return; }
    this.torrents_callbacks[torrent_id][t] = this.torrents_callbacks[torrent_id][t].filter(function(c) {
      return c != callback;
    });
  };
  
  var constructor = function() {};
  
  constructor.prototype = Transmission.extend(Transmission.EventDispatcher.prototype, {
    dispatchTorrentEvent: dispatchTorrentEvent,
    addTorrentEventListener: addTorrentEventListener,
    removeTorrentEventListener: removeTorrentEventListener
  });
  
  return constructor;
})();
