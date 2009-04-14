function() { return {
  // replace this with your real tests
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testGetAllIds: function() {
    var expected_command = Object.toJSON({
      method: 'torrent-get',
      arguments: { fields: [ 'id' ] }
    });
    
    var transport = new MockXmlHttpRequest();
    jack.expect('Ajax.getTransport').returnValue(transport);
    
    var remote = new Transmission.Remote();
    remote.requestAllTorrentIds();
    
    this.assertEqual(Transmission.Remote.URL, transport.url);
    this.assertEqual(expected_command, transport.data);
  }
  
}; }
