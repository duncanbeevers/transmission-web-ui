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
  
  testUpdateAttributes: function() {
    var torrent = new Transmission.Torrent(1);
    torrent.updateAttributes({
      hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcb'
    });
    this.assertEqual('b126e1ea1b49c79613f779ac0f36a9714e823fcb', torrent.getAttribute('hashString'));
  },
  
  testAddAttributeEventListener: function() {
    var torrent = new Transmission.Torrent(1),
        attribute_updated = false;
    torrent.addAttributeEventListener('hashString', function() {
      attribute_updated = true;
    });
    torrent.updateAttributes({ hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcb' });
    this.assert(attribute_updated);
  },
  
  testAttributeEventListenerShouldRequireChangeInValue: function() {
    var torrent = new Transmission.Torrent(1),
        attribute_updated = false;
    torrent.updateAttributes({ hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcb' });
    
    torrent.addAttributeEventListener('hashString', function() {
      attribute_updated = true;
    });
    torrent.updateAttributes({ hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcb' });
    this.assert(!attribute_updated);
  }
  
}; }
