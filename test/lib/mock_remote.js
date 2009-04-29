var MockRemote = (function() { return function() {
  var all_ids_requested = false;
  var requestAllTorrentIds = function() {
    all_ids_requested = true;
  };
  var haveAllIdsBeenRequested = function() { return all_ids_requested; }
  
  return {
    // Transmission.Remote methods
    requestAllTorrentIds: requestAllTorrentIds,
    
    // Mock instrumentation methods
    haveAllIdsBeenRequested: haveAllIdsBeenRequested
  };
}; })();
