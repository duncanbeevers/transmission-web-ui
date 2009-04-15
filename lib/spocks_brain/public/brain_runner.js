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

memoizeNodeFn = function(selector) {
  return (function() {
    var memo = undefined;
    return function() {
      if (memo) { return memo; }
      memo = $(selector);
      return memo;
    };
  })();
};

var BrainRunner = (function() {
  var queueNode = memoizeNodeFn('testsQueue');
  var iframeNode = memoizeNodeFn('runnerFrame');
  var implementation = function() {
    var workRequestThread;
    var testProcessThread;
    var high_water = new Date().getTime();
    
    var requestWork = function(test) {
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
    
    var runNextTest = function() {
      setTimeout(function() {
        var node = queueNode().firstDescendant();
        if (node) {
          iframeNode().src = node.value;
          node.remove();
        }
      }, 0);
    };
    
    var addTest = function(test) {
      var tests_count = queueNode().childElements().length;
      queueNode().insert(new Element('option').update(test));
      if (0 == tests_count) { runNextTest(); }
    };
    
    return {
      beginRequestingWork: function() {
        requestWork();
        workRequestThread = new PeriodicalExecuter(requestWork, 5);
      },
      addTestToQueue: function(test) {
        addTest(test);
      },
      runnerComplete: function(runner) {
        runNextTest();
      }
    };
  };
  
  return implementation;
}());

var brainRunner = new BrainRunner();
brainRunner.beginRequestingWork();
