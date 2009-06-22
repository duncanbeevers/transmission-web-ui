function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testAttributes: function() {
    var torrent = new Transmission.Torrent(),
        torrent_file = new Transmission.TorrentFile(torrent);
    torrent_file.updateAttributes({ name: 'Filename' });
    this.assertEqual('Filename', torrent_file.getAttribute('name'));
  },
  
  testGetTorrent: function() {
    var torrent = new Transmission.Torrent(),
        torrent_file = new Transmission.TorrentFile(torrent);
    this.assertEqual(torrent, torrent_file.getTorrent());
  },
  
  testAddAttributeEventListener: function() {
    var torrent = new Transmission.Torrent(),
        torrent_file = new Transmission.TorrentFile(torrent),
        bytes_completed_updated;
    
    torrent_file.addAttributeEventListener('bytesCompleted', function() {
      bytes_completed_updated = true;
    });
    
    torrent_file.updateAttributes({
      bytesCompleted: 1000
    });
    
    this.assert(bytes_completed_updated);
  }
  
}; }
