//= require <transmission>
//= require <events>
//= require <torrent>

/**
  The TorrentListManager is the canonical source for
  what torrents the web ui is tracking.
**/
Transmission.TorrentListEvent = Transmission.Events(
  'TorrentAdded', 'TorrentRemoved'
);

Transmission.TorrentListManager = (function() { return function() {
  var ids = [],
      torrents = {};
  
  var getIds = function() { return ids; };
  var getTorrent = function(id) { return torrents[id]; };
  
  var addIds = function(ids_to_add) {
    var tlm = this;
    ids_to_add.each(function(id) {
      torrents[id] = new Transmission.Torrent(id);
      tlm.dispatchEvent(
        new Transmission.TorrentListEvent.TorrentAdded( { torrent: torrents[id] } )
      );
    });
    ids = ids.concat(ids_to_add);
  };
  
  var removeIds = function(ids_to_remove) {
    var tlm = this;
    ids_to_remove.each(function(id) {
      tlm.dispatchEvent(
        new Transmission.TorrentListEvent.TorrentRemoved( { torrent: torrents[id] } )
      )
    });
    ids = ids.filter(function(id) {
      return !ids_to_remove.include(id);
    });
  };
  
  var newIdsInList = function(all_ids) {
    return all_ids.filter(function(id) {
      return !ids.include(id);
    })
  };
  
  
  return Transmission.extend(Transmission.EventDispatcher, {
    getIds: getIds,
    getTorrent: getTorrent,
    addIds: addIds,
    removeIds: removeIds,
    newIdsInList: newIdsInList
  });
  
}; }());
