//= require <transmission>

/* Trasmission.Remote is responsible for transmitting messages to the rpc server
    and ferrying the responses back to interested parties.
*/
Transmission.Remote = (function() {
  var klass = function() {
    return {
      requestAllTorrentIds: function() {
        new Ajax.Request(Transmission.Remote.URL, {
          postBody: Object.toJSON({
            method: 'torrent-get',
            arguments: { fields: [ 'id' ] }
          })
        })
      }
    };
  };
  
  return klass;
}());

Transmission.Remote.URL = '<%= RPC_URL %>';