// Wire up add test url to queue button
document.observe('dom:loaded', function() {
  $('testRunControls').observe('submit', function(e) {
    var test_name_node = this.down('.testName');
    var value = test_name_node.value;
    if (value) {
      brainRunner.addTestToQueue(value);
    }
    e.stop();
  });
});

var BrainRunner = (function() {
  var memoizeNodeFn = function(selector) {
    var memo = undefined;
    return function() {
      if (memo) { return memo; }
      memo = $(selector);
      return memo;
    };
  };
  
  var queueNode = memoizeNodeFn('testsQueue');
  var iframeNode = memoizeNodeFn('runnerFrame');
  var statusNode = memoizeNodeFn('stateName');
  var implementation = function() {
    var requestWorkThread;
    var processWorkThread;
    var high_water = new Date().getTime();
    
    var requestWork = function() {
      new Ajax.Request('/work', {
        method: 'get',
        parameters: { since: high_water.toString() },
        onSuccess: function(response) {
          var new_tests = response.responseText.evalJSON();
          if (new_tests && new_tests.length) {
            new_tests.each(function(test) {
              var job_time = test.ts;
              if (job_time > high_water) { high_water = job_time; }
              try { addTest(test.url); } catch(_) { }
            });
          }
        }
      });
    };
    
    var testRunning;
    var processWork = function() {
      var queue = queueNode();
      if (queue) {
        var tests_count = queue.childElements().length;
        if (!testRunning && tests_count) { runNextTest(); }
      }
    };
    
    var runNextTest = function() {
      setTimeout(function() {
        var node = queueNode().firstDescendant();
        if (node) {
          testRunning = node.value;
          updateStatus(testRunning, 'running');
          iframeNode().src = node.value;
          node.remove();
        }
      }, 0);
    };
    
    var testComplete = function() {
      updateStatusWaiting();
      runNextTest();
    };
    
    var currentState;
    var updateStatus = function(status, state) {
      var node = statusNode();
      if (node) {
        if (currentState) { node.removeClassName(currentState); }
        node.addClassName(state);
        // node.update(status);
      }
      currentState = state;
    };
    var updateStatusWaiting = function() {
      testRunning = false;
      updateStatus('', 'waiting');
    };
    
    var addTest = function(test) {
      queueNode().insert(new Element('option').update(test));
    };
    
    return {
      beginRequestingWork: function() {
        updateStatusWaiting();
        requestWork();
        requestWorkThread = new PeriodicalExecuter(requestWork, 5);
      },
      beginProcessingWork: function() {
        processWork();
        processWorkThread = new PeriodicalExecuter(processWork, 5);
      },
      addTestToQueue: function(test) {
        addTest(test);
      },
      runnerComplete: function(runner) {
        testComplete();
      }
    };
  };
  
  return implementation;
})();

var brainRunner = new BrainRunner();
document.observe('dom:loaded', function() {
  brainRunner.beginRequestingWork();
  brainRunner.beginProcessingWork();
});
