function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testGetTorrents: function() {
    var ui = new Transmission.WebUI();
    this.assertEnumEqual([ ], ui.getTorrents());
  }
  
}; }
