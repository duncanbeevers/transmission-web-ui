function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testMarkupReady: function() {
    var ui = new Transmission.WebUI(new Transmission.Config(), new Transmission.Remote());
    this.assertNothingRaised(function() {
      ui.markupReady();
    });
  }
  
}; }
