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
  },
  
  testUpdateFiles: function() {
    var torrent = new Transmission.Torrent(1);
    torrent.updateAttributes({
      files: [ { name: 'File1' } ]
    });
    
    var torrent_file = torrent.getFiles()[0];
    this.assertNotUndefined(torrent_file,
      'Expected torrent to have torrent file');
    
    this.assertEqual('File1', torrent_file.getAttribute('name'),
      'Expected updateAttributes to update files');
  }  
}; }
