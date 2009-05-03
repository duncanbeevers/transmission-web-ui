# Transmission Web Interface

## Using
This web interface is a drop-in replacement for Transmission's own.<br />
To launch Transmission on your Mac with this web interface enabled,
run the rake task:

  <tt>rake lt</tt>

## Running Test
Launch the test server
  <tt>script/server</tt> to launch sprocketizing server and test work handler
  <tt>script/js_autotest</tt> to begin watching source files to push jobs to processor


## Thanks
* JavaScript unit testing implemented with [jsunittest](http://jsunittest.com/)
* Mocking implemented with [jack](http://boss.bekk.no/display/BOSS/Jack)
* mockxmlhttprequest lifted from jsunit
* Preprocessing implemented with [sprockets](http://www.getsprockets.org)
* Icons from [fugue](http://www.pinvoke.com/)
* [Gauge.js](http://www.netzgesta.de/gauge/) graphics library by Christian Effenberger
* RegExp.escape from [Simon Willison](http://simonwillison.net/2006/Jan/20/escape/)
