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
  },
  
  testAddAttributesEventListener: function() {
    var torrent = new Transmission.Torrent(1),
        attribute_update_count = 0;
    torrent.addAttributesEventListener([ 'haveUnchecked', 'hashString' ], function() {
      attribute_update_count++;
    });
    
    torrent.updateAttributes({ hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcb' });
    this.assertEqual(1, attribute_update_count);
    
    torrent.updateAttributes({ haveUnchecked: 10 });
    this.assertEqual(2, attribute_update_count);
    
    torrent.updateAttributes({
      hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcc',
      haveUnchecked: 11
    });
    this.assertEqual(3, attribute_update_count);
  }
  
}; }
