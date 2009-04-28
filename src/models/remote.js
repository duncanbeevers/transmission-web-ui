//= require <transmission>

/* Trasmission.Remote is responsible for transmitting messages to the rpc server
    and ferrying the responses back to interested parties.
*/
Transmission.Remote = (function() { return function() {
  var rpc = function(data, callback) {
    new Ajax.Request(Transmission.Remote.URL, {
      postBody: Object.toJSON(data),
      onSuccess: function(response) {
        var json = response.responseJSON;
        if ('success' === json.result) {
          callback(json.arguments);
        }
      }
    });
  };
  
  var requestAllTorrentIds = function(callback) {
    rpc({
      method: 'torrent-get',
      arguments: { fields: [ 'id' ] }
    }, function(args) {
      callback(args.torrents.pluck('id'));
    });
  };
  
  return {
    requestAllTorrentIds: requestAllTorrentIds
  };
}; }());

Transmission.Remote.URL = '<%= RPC_URL %>';
