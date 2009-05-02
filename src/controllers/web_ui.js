//= require <transmission>
//= require <torrent_list_manager>
//= require <config>
//= require <remote>
//= require <timer>

/* The WebUI is the application ojbect responsible for instantiating
    and coordinating other view components.
*/
Transmission.WebUI = (function() { return function(config, remote) {
  var torrent_list_manager = new Transmission.TorrentListManager();
  
  var ids_to_process = [];
  var updateAllIds = function() {
    remote.addEventListener(Transmission.RemoteEvent.ReceivedAllTorrentIds,
      function(event) {
        ids_to_process = ids_to_process.concat(event.getData().ids);
        torrent_list_updater.start();
      });
    remote.requestAllTorrentIds();
  };
  var addSliceOfIds = function() {
    var ids = ids_to_process.splice(0, config.TORRENT_IDS_TO_ADD_PER_PROCESS_INTERVAL),
        new_ids = torrent_list_manager.newIdsInList(ids);
    
    if (new_ids.length) { torrent_list_manager.addIds(new_ids); }
  };
  
  var torrent_list_updater = new Transmission.Timer(addSliceOfIds, config.TORRENT_IDS_PROCESS_INTERVAL);
  
  var start = function() {
    updateAllIds();
  };
  
  var getTorrent = function(id) {
    return torrent_list_manager.getTorrent(id);
  };
  
  return {
    markupReady: start,
    start: start,
    getTorrent: getTorrent
  };
}; }());
