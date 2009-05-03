//= require <transmission>
//= require <torrent_list_manager>
//= require <torrent_list_bootstrapper>
//= require <config>
//= require <remote>

/* The WebUI is the application ojbect responsible for instantiating
    and coordinating other view components.
*/
Transmission.WebUI = (function() { return function(config, remote) {
  var torrent_list_manager = new Transmission.TorrentListManager();
  var bootstrapper = new Transmission.TorrentListBootstrapper(
    config.TORRENT_IDS_TO_ADD_PER_PROCESS_INTERVAL,
    config.TORRENT_IDS_PROCESS_INTERVAL,
    torrent_list_manager.addIds,
    remote);
  
  var start = function() {
    bootstrapper.start();
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
