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
    var new_ids = newIdsInList(ids_to_add), id;
    for (var i = new_ids.length - 1; i >= 0; i--) {
      id = new_ids[i];
      torrents[id] = new Transmission.Torrent(id);
      torrent_list_manager.dispatchEvent(
        new Transmission.TorrentListEvent.TorrentAdded({
          torrent: torrents[id]
        })
      );
    }
    ids = ids.concat(new_ids);
  };
  
  var removeIds = function(ids_to_remove) {
    for (var i = ids_to_remove.length - 1; i >= 0; i--) {
      torrent_list_manager.dispatchEvent(
        new Transmission.TorrentListEvent.TorrentRemoved({
          torrent: torrents[ids_to_remove[i]]
        })
      );
    }
    ids = ids.filter(function(id) {
      return !ids_to_remove.include(id);
    });
  };
  
  var newIdsInList = function(all_ids) {
    return all_ids.filter(function(id) {
      return !ids.include(id);
    })
  };
  
  
  var torrent_list_manager = Transmission.extend(new Transmission.EventDispatcher(), {
    getIds: getIds,
    getTorrent: getTorrent,
    addIds: addIds,
    removeIds: removeIds
  });
  
  return torrent_list_manager;
  
}; }());
