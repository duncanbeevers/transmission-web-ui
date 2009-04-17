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
    
    var transport = new MockXmlHttpRequest().serverResponds();
    jack.expect('Ajax.getTransport').returnValue(transport);
    
    var remote = new Transmission.Remote();
    var callbackCalled = false;
    remote.requestAllTorrentIds(function() {
      callbackCalled = true;
    });
    
    this.assertEqual(Transmission.Remote.URL, transport.url);
    this.assertEqual(expected_command, transport.data);
    this.assert(callbackCalled);
  }
  
}; }
