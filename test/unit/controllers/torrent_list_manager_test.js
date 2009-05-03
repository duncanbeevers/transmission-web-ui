function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  testGetIds: function() {
    var tlm = new Transmission.TorrentListManager();
    this.assertEnumEqual([ ], tlm.getIds());
  },
  
  testGetTorrent: function() {
    var tlm = new Transmission.TorrentListManager();
    tlm.addIds([ 1 ]);
    this.assertEqual(1, tlm.getTorrent(1).getId());
  },
  
  testAddIds: function() {
    var tlm = new Transmission.TorrentListManager();
    tlm.addIds([ 1 ]);
    this.assertSameElements([ 1 ], tlm.getIds());
  },
  
  testAddIdsDoesntDuplicate: function() {
    var tlm = new Transmission.TorrentListManager();
    tlm.addIds([ 1 ]);
    tlm.addIds([ 1 ]);
    this.assertSameElements([ 1 ], tlm.getIds());
  },
  
  testRemoveIds: function() {
    var tlm = new Transmission.TorrentListManager();
    tlm.addIds([ 1, 2 ]);
    tlm.removeIds([ 1 ]);
    this.assertSameElements([ 2 ], tlm.getIds());
  },
  
  testOnTorrentAdded: function() {
    var torrent_added;
    var tlm = new Transmission.TorrentListManager();
    
    tlm.addEventListener(Transmission.TorrentListEvent.TorrentAdded,
      function(event) {
        torrent_added = event.getData().torrent;
      });
    
    tlm.addIds([ 1 ]);
    this.wait(10, function() {
      this.assertEqual(1, torrent_added.getId());
    });
  },
  
  testOnTorrentRemoved: function() {
    var torrent_removed;
    var tlm = new Transmission.TorrentListManager();
    
    tlm.addEventListener(Transmission.TorrentListEvent.TorrentRemoved,
      function(event) {
        torrent_removed = event.getData().torrent;
      });
    
    tlm.addIds([ 1 ]);
    tlm.removeIds([ 1 ]);
    this.wait(10, function() {
      this.assertEqual(1, torrent_removed.getId());
    });
  }
  
}; }
