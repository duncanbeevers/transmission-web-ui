document.observe('dom:loaded', function() {
  $('testRunControls').observe('submit', function(e) {
    var test_name_node = this.down('.testName');
    var value = test_name_node.value;
    console.log(test_name_node);
    if (value) {
      console.log(value);
      $('runnerFrame').src = '/test/' + value;
    } else {
      console.log('no value ' + value);
    }
    e.stop();
  });
});
