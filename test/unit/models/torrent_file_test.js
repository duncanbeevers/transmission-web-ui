function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testInitialAttributes: function() {
    var torrent = new Transmission.Torrent(),
        torrent_file = new Transmission.TorrentFile(torrent, { name: 'Filename' });
    this.assertEqual('Filename', torrent_file.getAttribute('name'));
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
  }
  
}; }
