//= require <transmission>
//= require <events>
//= require <timer>
//= require <remote>

/**
  The TorrentListBootstrapper requests the initial list of ids currently
  known-about by the server and hands those ids off in slices
**/
Transmission.TorrentListBootstrapperEvent = Transmission.Events('AddedSlice');

Transmission.TorrentListBootstrapper = (function() { return function(
    ids_to_add_per_process_interval,
    process_interval,
    remote) {
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
    var ids = ids_to_process.splice(0, ids_to_add_per_process_interval);
    
    if (ids.length) {
      bootstrapper.dispatchEvent(
        new Transmission.TorrentListBootstrapperEvent.AddedSlice({ ids: ids })
      );
    } else {
      torrent_list_updater.stop();
    }
  };
  var torrent_list_updater = new Transmission.Timer(addSliceOfIds, process_interval);
  
  var bootstrapper = Transmission.extend(new Transmission.EventDispatcher(), {
    start: updateAllIds
  });
  
  return bootstrapper;
}; })();
