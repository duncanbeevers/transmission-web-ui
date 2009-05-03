function() { return {
  // replace this with your real tests
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testGetId: function() {
    var torrent = new Transmission.Torrent(1);
    this.assertEqual(1, torrent.getId());
  },
  
  testGetFiles: function() {
    var torrent = new Transmission.Torrent(1);
    this.assertSameElements([], torrent.getFiles());
  }
  
}; }
