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
    var remote = new Transmission.Remote();
    var ui = new Transmission.WebUI(new Transmission.Config(), remote);
    
    var have_all_ids_been_requested = false;
    remote.addEventListener(Transmission.RemoteEvent.RequestedAllTorrentIds, function() {
      have_all_ids_been_requested = true;
    });
    
    ui.start();
    this.wait(10, function() {
      this.assert(have_all_ids_been_requested);
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
        new Transmission.RemoteEvent.ReceivedAllTorrentIds( { ids: [ 1, 2, 3 ] } )
      );
      this.wait(10, function() {
        this.assert(ui.getTorrent(1));
        this.assert(ui.getTorrent(2));
        this.assertUndefined(ui.getTorrent(3));
      });
    });
  }
  
}; }
