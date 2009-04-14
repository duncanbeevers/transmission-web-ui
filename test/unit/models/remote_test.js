function() { return {
  // replace this with your real tests
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testGetAllIds: function() {
    var expected_command = {
      method: 'torrent-get',
      arguments: { fields: [ 'id' ] }
    };
    
    jack.expect('Ajax.Request').
      whereArgument(0).is(Transmission.Remote.URL).
      whereArgument(1).hasProperty('parameters', expected_command).
      mock(Prototype.emptyFunction);
    
    var remote = new Transmission.Remote();
    remote.requestAllTorrentIds();
  }
  
}; }
