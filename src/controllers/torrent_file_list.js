//= require <transmission>
//= require <torrent_events>
//= require <remote>
//= require <torrent>

/**
  The TorrentFileList presents an interface for manipulating individual
  files and directories within a torrent including setting wantedness
  and download priority.
**/
Transmission.TorrentFileListEvents = Transmission.Events();

Transmission.TorrentFileList = (function() {
  var bootstrap_fields = [ 'files' ];
  
return function(torrent, remote) {
  var torrent_id = torrent.getId();
  
  var onReceivedTorrentFields = function(event) {
    remote.removeTorrentEventListener(
      Transmission.RemoteEvent.ReceivedTorrentFields,
      torrent_id,
      onReceivedTorrentFields);
  };
  
  remote.addTorrentEventListener(
    Transmission.RemoteEvent.ReceivedTorrentFields,
    torrent_id, onReceivedTorrentFields);
  
  remote.groupedRequestFields( [ torrent_id ], bootstrap_fields, <%= TORRENT_FILE_LIST_BOOTSTRAP_GROUP_INTERVAL %>);
  
  return {
    
  };
}; })();
