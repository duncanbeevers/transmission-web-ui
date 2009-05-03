//= require <transmission>
//= require <events>

/**
  When a class needs to register event listeners it returns
  an object which protypically-extends EventDispatcher,
  allowing callbacks for specific event types to be registered
  on the instance.
  
  Event dispatch itself should be invoked within the instance.
**/
Transmission.TorrentEventDispatcher = (function() {
  var torrents_callbacks = {};
  
  return Transmission.extend(Transmission.EventDispatcher, {
    dispatchTorrentEvent: function(event) {
      var data = event.getData().torrent_data,
          torrent_callbacks = torrents_callbacks[data.id];
      if (!torrent_callbacks) { return; }
      
      var callbacks = torrent_callbacks[event.getType()];
      if (!callbacks) { return; }
      
      for (var i = callbacks.length - 1; i >= 0; i--) {
        callbacks[i].defer(event);
      }
    },
    
    addTorrentEventListener: function(event_type, torrent_id, callback) {
      var t = event_type.getType();
      if (!torrents_callbacks[torrent_id]) {
        torrents_callbacks[torrent_id] = {};
      }
      if (!torrents_callbacks[torrent_id][t]) {
        torrents_callbacks[torrent_id][t] = [];
      }
      torrents_callbacks[torrent_id][t].push(callback);
    }
  });
} ());
