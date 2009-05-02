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
    
    var all_ids_requested = false,
        ids = [],
        url = '/specified_url',
        remote = new Transmission.Remote(url);
    
    remote.addEventListener(Transmission.RemoteEvent.RequestedAllTorrentIds, function(event) {
      all_ids_requested = true;
    });
    remote.addEventListener(Transmission.RemoteEvent.ReceivedAllTorrentIds, function(event) {
      ids = event.getData().ids
    });
    remote.requestAllTorrentIds();
    
    this.assertEqual(url, transport.url);
    this.assertEqual(expected_command, transport.data);
    
    // Wait for events to fire
    this.wait(100, function() {
      this.assertSameElements([ 1 ], ids, 'Expected event to have list of ids');
      this.assert(all_ids_requested);
    }.bind(this));
  }
  
}; }
