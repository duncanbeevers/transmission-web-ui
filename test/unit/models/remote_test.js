function() { return {
  // replace this with your real tests
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testGetAllIds: function() {
    var transport = new MockXmlHttpRequest().serverRespondsJSON({
      arguments: {
        torrents: [ { id: 1 } ]
      },
      result: 'success'
    });
    jack.expect('Ajax.getTransport').returnValue(transport);
    
    var expected_command = Object.toJSON({
      method: 'torrent-get',
      arguments: { fields: [ 'id' ] }
    });
    
    var ids = [], remote = new Transmission.Remote();
    remote.addEventListener(Transmission.RemoteEvent.RequestAllTorrentIds, function(event) {
      ids = event.getData().ids
    });
    remote.requestAllTorrentIds();
    
    this.assertEqual(Transmission.Remote.URL, transport.url);
    this.assertEqual(expected_command, transport.data);
    
    // Wait for events to fire
    this.wait(100, function() {
      this.assertSameElements([ 1 ], ids, 'Expected event to have list of ids');
    }.bind(this));
  }
  
}; }
