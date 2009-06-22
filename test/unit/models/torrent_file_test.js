function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testGetTorrent: function() {
    var torrent = new Transmission.Torrent(),
        torrent_file = new Transmission.TorrentFile(torrent);
    this.assertEqual(torrent, torrent_file.getTorrent());
  }
  
}; }
