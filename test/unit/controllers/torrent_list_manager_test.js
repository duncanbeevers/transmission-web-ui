function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  testGetIds: function() {
    var tlm = new Transmission.TorrentListManager();
    this.assertEnumEqual([ ], tlm.getIds());
  },
  
  testAddIds: function() {
    var tlm = new Transmission.TorrentListManager();
    tlm.addIds([ 1 ]);
    this.assertSameElements([ 1 ], tlm.getIds());
  },
  
  testRemoveIds: function() {
    var tlm = new Transmission.TorrentListManager();
    tlm.addIds([ 1, 2 ]);
    tlm.removeIds([ 1 ]);
    this.assertSameElements([ 2 ], tlm.getIds());
  },
  
  testNewIdsInList: function() {
    var tlm = new Transmission.TorrentListManager();
    tlm.addIds([ 1 ]);
    var all_torrent_ids = [ 1, 2 ];
    this.assertSameElements([ 2 ], tlm.newIdsInList(all_torrent_ids));
  }
  
}; }
