//= require <transmission>

/* The WebUI is the application ojbect responsible for instantiating
    and coordinating other view components.
*/
Transmission.WebUI = (function() { return function() {
  var torrents = [];
  
  return {
    getTorrents: function() {
      return torrents;
    }
  };
}; }());
