var MockRemote = (function() { return function() {
  var requestAllTorrentIds = function(callback) {
    callback.defer(0, torrent_ids);
  };
  
  var torrent_ids = [];
  var setAllTorrentIds = function(ids) {
    torrent_ids = ids;
  }
  
  return {
    // Transmission.Remote methods
    requestAllTorrentIds: requestAllTorrentIds,
    
    // Mock instrumentation methods
    setAllTorrentIds: setAllTorrentIds
  };
}; })();
