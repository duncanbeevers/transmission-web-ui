function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testInterval: function() {
    var timer = new Transmission.Timer(Prototype.emptyFunction, 1000);
    
    this.assertEqual(1000, timer.interval());
  },
  
  testShouldNotInvokeFunctionOnInstantiation: function() {
    var invocations_count = 0,
        timer = new Transmission.Timer(function() {
          invocations_count += 1;
        }, 1000);
    this.assertEqual(0, invocations_count);
  },
  
  testShouldInvokeFunctionOnStart: function() {
    var invocations_count = 0,
        timer = new Transmission.Timer(function() {
          invocations_count += 1;
        }, 1000);
    timer.start();
    timer.stop();
    this.assertEqual(1, invocations_count);
  },
  
  testShouldNotReinvokeWhenRunning: function() {
    var invocations_count = 0,
        timer = new Transmission.Timer(function() {
          invocations_count += 1;
        }, 1000);
    timer.start();
    timer.start();
    timer.stop();
    this.assertEqual(1, invocations_count);
  },
  
  testRepeat: function() {
    var invocations_count = 0,
        interval = 100,
        expected_invocations_count = 4,
        timer = new Transmission.Timer(function() {
          invocations_count += 1;
        }, interval);
    timer.start();
    
    this.wait(interval * expected_invocations_count - interval / 2,
      function() {
        timer.stop();
        this.assertEqual(expected_invocations_count, invocations_count);
      });
  },
  
  testStop: function() {
    var invocations_count = 0,
        interval = 100,
        expected_invocations_count = 4,
        timer = new Transmission.Timer(function() {
          invocations_count += 1;
        }, interval);
    timer.start();
    
    this.wait(interval * expected_invocations_count - interval / 2,
      function() {
        timer.stop();
        this.wait(interval, function() {
          this.assertEqual(expected_invocations_count, invocations_count);
        });
      });
  }
  
}; }
