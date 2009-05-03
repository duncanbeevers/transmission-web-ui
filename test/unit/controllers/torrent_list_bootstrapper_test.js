function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testRequestsIds: function() {
    var remote = new Transmission.Remote({});
    var bootstrapper = new Transmission.TorrentListBootstrapper(
      10, 10000, remote);
    
    var have_all_ids_been_requested = false;
    remote.addEventListener(Transmission.RemoteEvent.RequestedAllTorrentIds, function() {
      have_all_ids_been_requested = true;
    });
    
    bootstrapper.start();
    this.wait(10, function() {
      this.assert(have_all_ids_been_requested);
    });
  },
  
  testProcessesSlicesOfIds: function() {
    var added_ids = null;
    var remote = new Transmission.Remote({});
    var bootstrapper = new Transmission.TorrentListBootstrapper(
      2, 10000, remote);
    
    bootstrapper.addEventListener(
      Transmission.TorrentListBootstrapperEvent.AddedSlice,
      function(event) {
        if (!added_ids) { added_ids = event.getData().ids; }
      });
    
    bootstrapper.start();
    remote.dispatchEvent(
      new Transmission.RemoteEvent.ReceivedAllTorrentIds( { ids: [ 1, 2, 3 ] } )
    );
    this.wait(100, function() {
      this.assertSameElements([ 1, 2 ], added_ids);
    });
  }
  
}; }
