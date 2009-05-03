function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testRequestsIds: function() {
    var remote = new Transmission.Remote();
    var bootstrapper = new Transmission.TorrentListBootstrapper(
      10, 10000, Prototype.emptyFunction, remote);
    
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
    var added_ids = [], addIds = function(ids) {
      added_ids = ids;
    };
    var remote = new Transmission.Remote();
    var bootstrapper = new Transmission.TorrentListBootstrapper(
      2, 10000, addIds, remote);
    
    bootstrapper.start();
    remote.dispatchEvent(
      new Transmission.RemoteEvent.ReceivedAllTorrentIds( { ids: [ 1, 2, 3 ] } )
    );
    this.wait(10, function() {
      this.assertSameElements([ 1, 2 ], added_ids);
    });
  }
  
}; }
