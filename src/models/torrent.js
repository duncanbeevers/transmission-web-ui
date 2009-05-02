//= require <transmission>
//= require <events>

Transmission.Torrent = (function() { return function(id) {
  return {
    getId: function() {
      return id;
    }
  };
}; })();
