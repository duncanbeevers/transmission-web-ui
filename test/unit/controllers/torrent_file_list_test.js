function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testRequestsFields: function() {
    var remote = new Transmission.Remote({});
    
    var requested_torrent_id;
    remote.addTorrentEventListener(
      Transmission.RemoteEvent.ReceivedTorrentFields, 1,
      function(event) {
        requested_torrent_id = event.getData().torrent_data.id;
      }
    );
    var list = new Transmission.TorrentFileList(new Transmission.Torrent(1), remote);
    remote.dispatchTorrentEvent(new Transmission.RemoteEvent.ReceivedTorrentFields(
      { torrent_data: { id: 1, files: [
        { bytesCompleted: 999, length: 1000, name: 'movie.avi' }
      ] }}
    ));
    this.wait(10, function() {
      this.assert(1, requested_torrent_id);
    });
  }
  
}; }
