function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testMarkupReady: function() {
    var ui = new Transmission.WebUI();
    this.assertNothingRaised(function() {
      ui.markupReady();
    });
  },
  
  testRequestsIds: function() {
    var remote = new MockRemote();
    var ui = new Transmission.WebUI(remote);
    this.assert(remote.haveAllIdsBeenRequested);
  }
  
}; }
