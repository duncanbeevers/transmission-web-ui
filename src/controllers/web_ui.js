//= require <transmission>
//= require <torrent_list_manager>
//= require <remote>
//= require <timer>

/* The WebUI is the application ojbect responsible for instantiating
    and coordinating other view components.
*/
Transmission.WebUI = (function() { return function(remote) {
  var torrent_list_manager = new Transmission.TorrentListManager();
  
  var addSliceOfIds = function(ids) {
    torrent_list_manager.addIds(
      torrent_list_manager.newIdsInList(ids).slice(0, 10)
    );
  };
  var updateAllIds = function() {
    remote.requestAllTorrentIds(addSliceOfIds);
  };
  
  var torrent_list_updater = new Transmission.Timer(updateAllIds, <%= TORRENT_IDS_POLL_INTERVAL %>);
  
  var start = function() {
    torrent_list_updater.start();
  }
  
  var markupReady = function() {
    if (remote) {
      start();
    }
  };
  
  var getTorrent = function(id) {
    return torrent_list_manager.getTorrent(id);
  };
  
  return {
    markupReady: markupReady,
    getTorrent: getTorrent
  };
}; }());
