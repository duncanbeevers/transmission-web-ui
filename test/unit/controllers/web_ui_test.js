function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testMarkupReady: function() {
    var config = new Transmission.Config();
    var ui = new Transmission.WebUI(config, new Transmission.Remote(config));
    this.assertNothingRaised(function() {
      ui.markupReady();
    });
  }
  
}; }
