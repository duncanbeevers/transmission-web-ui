function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testInterval: function() {
    var timer = new Timer(function() {}, 1000);
    
    this.assertEqual(1000, timer.interval());
  }
  
}; }
