function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testInterval: function() {
    var timer = new Timer(Prototype.emptyFunction, 1000);
    
    this.assertEqual(1000, timer.interval());
  },
  
  testShouldNotInvokeFunctionOnInstantiation: function() {
    var invocations_count = 0;
        timer = new Timer(function() {
          invocations_count += 1;
        }, 1000);
    this.assertEqual(0, invocations_count);
  },
  
  testShouldInvokeFunctionOnStart: function() {
    var invocations_count = 0;
        timer = new Timer(function() {
          invocations_count += 1;
        }, 1000);
    timer.start();
    timer.stop();
    this.assertEqual(1, invocations_count);
  }
  
}; }
