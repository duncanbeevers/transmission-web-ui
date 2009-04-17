function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testGetTorrents: function() {
    var transmission = new Transmission();
    this.assertEnumEqual([ ], transmission.getTorrents());
  }
  
}; }
