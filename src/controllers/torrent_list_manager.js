//= require <transmission>
//= require <events>
//= require <torrent>

/* Transmission TorrentListManager establishes a top-level
    namespace for all application objects
    in order to isolate them from external libraries.
*/
Transmission.TorrentListManager = (function() { return function() {
  var ids = [],
      torrents = {};
  
  var getIds = function() { return ids; };
  
  var addIds = function(ids_to_add) {
    var tlm = this;
    ids_to_add.each(function(id) {
      torrents[id] = new Transmission.Torrent(id);
      tlm.dispatchEvent(
        new Transmission.TorrentEvent.TorrentAdded( { torrent: torrents[id] } )
      );
    });
    ids = ids.concat(ids_to_add);
  };
  
  var removeIds = function(ids_to_remove) {
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
    addIds: addIds,
    removeIds: removeIds,
    newIdsInList: newIdsInList
  });
  
}; }());
