//= require <transmission>

/**
  A config is namespace where all the constants corresponding to
  configurable options of a web ui live.
**/
Transmission.Config = (function() { return function(options) {
  return Object.extend(<%= CONFIG_JSON %>, options || {});
}; })();
