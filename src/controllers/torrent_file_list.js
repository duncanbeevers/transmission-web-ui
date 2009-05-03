//= require <transmission>
//= require <events>
//= require <remote>
//= require <torrent>

/**
  The TorrentFileList presents an interface for manipulating individual
  files and directories within a torrent including setting wantedness
  and download priority.
**/
Transmission.TorrentFileListEvents = Transmission.Events();

Transmission.TorrentFileList = (function() { return function(torrent, remote) {
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
  
  remote.requestFields( [ torrent_id ], [ 'files' ]);
  
  return {
    
  };
}; })();
