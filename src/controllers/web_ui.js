//= require <transmission>
//= require <torrent_list_manager>
//= require <torrent_list_bootstrapper>
//= require <torrent_file_list>
//= require <config>
//= require <remote>

/* The WebUI is the application ojbect responsible for instantiating
    and coordinating other view components.
*/
Transmission.WebUI = (function() { return function(config, remote) {
  var torrent_list_manager = new Transmission.TorrentListManager();
  
  // Bootstrap the torrent list manager with the list of torrents
  // known to the server
  var bootstrapper = new Transmission.TorrentListBootstrapper(
    config.TORRENT_IDS_TO_ADD_PER_PROCESS_INTERVAL,
    config.TORRENT_IDS_PROCESS_INTERVAL,
    remote);
  bootstrapper.addEventListener(Transmission.TorrentListBootstrapperEvent,
    function(event) {
      torrent_list_manager.addIds(event.getData().ids);
    });
  
  // View Controllers
  var torrent_file_lists = {};
  torrent_list_manager.addEventListener(
    Transmission.TorrentListEvent.TorrentAdded,
    function(event) {
      var torrent = event.getData().torrent;
      torrent_file_lists[ torrent.getId() ] = new Transmission.TorrentFileList(torrent, remote);
    }
  );
  
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
