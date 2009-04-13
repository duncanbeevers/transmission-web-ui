try { Transmission; } catch(_) { Transmission = {}; }
/* Transmission TorrentListManager establishes a top-level
    namespace for all application objects
    in order to isolate them from external libraries.
*/
Transmission.TorrentListManager = (function() { return function() {
  var ids = [];
  
  return {
    getIds: function() {
      return ids;
    },
    
    addIds: function(ids_to_add) {
      ids = ids.concat(ids_to_add);
    },
    
    removeIds: function(ids_to_remove) {
      ids = ids.filter(function(id) {
        return !ids_to_remove.include(id);
      });
    },
    
    newIdsInList: function(all_ids) {
      return all_ids.filter(function(id) {
        return !ids.include(id);
      });
    }
  };
}; }());
