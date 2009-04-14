//= require <transmission>

/* Trasmission.Remote is responsible for transmitting messages to the rpc server
    and ferrying the responses back to interested parties.
*/
Transmission.Remote = (function() {
  var klass = function() {
    return {
      requestAllTorrentIds: function() {
        
      }
    };
  };
  
  klass.URL = '/transmission/rpc';
  return klass;
}());
