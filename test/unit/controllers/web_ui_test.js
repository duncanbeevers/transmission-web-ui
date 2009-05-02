function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testMarkupReady: function() {
    var ui = new Transmission.WebUI(new Transmission.Config(), new Transmission.Remote());
    this.assertNothingRaised(function() {
      ui.markupReady();
    });
  },
  
  testRequestsIds: function() {
    var remote = new MockRemote();
    var ui = new Transmission.WebUI(new Transmission.Config(), remote);
    ui.start();
    this.wait(10, function() {
      this.assert(remote.haveAllIdsBeenRequested());
    });
  },
  
  testProcessesSlicesOfIds: function() {
    var remote = new Transmission.Remote();
    var ui = new Transmission.WebUI(new Transmission.Config({
      'TORRENT_IDS_PROCESS_INTERVAL': 10000,
      'TORRENT_IDS_TO_ADD_PER_PROCESS_INTERVAL': 2
    }), remote);
    
    ui.start();
    
    this.wait(10, function() {
      remote.dispatchEvent(
        new Transmission.RemoteEvent.RequestAllTorrentIds( { ids: [ 1, 2, 3 ] } )
      );
      this.wait(10, function() {
        this.assert(ui.getTorrent(1));
        this.assert(ui.getTorrent(2));
        this.assertUndefined(ui.getTorrent(3));
      });
    });
  }
  
}; }
