//= require <prototype>

/* Transmission establishes a top-level namespace for all application objects
    in order to isolate them from external libraries.
*/
Transmission = (function() { return function() {
  var torrents = [];
  
  return {
    getTorrents: function() {
      return torrents;
    }
  };
}; }());
