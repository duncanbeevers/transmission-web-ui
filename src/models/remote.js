//= require <transmission>
//= require <events>

/* Trasmission.Remote is responsible for transmitting messages to the rpc server
    and ferrying the responses back to interested parties.
*/
Transmission.RemoteEvent = Transmission.Events('RequestAllTorrentIds');

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
  
  var torrentGet = function(args, callback) {
    rpc({ method: 'torrent-get', arguments: args }, callback);
  };
  
  var requestAllTorrentIds = function() {
    var remote = this;
    torrentGet({
      fields: [ 'id' ]
    }, function(args) {
      remote.dispatchEvent(
        new Transmission.RemoteEvent.RequestAllTorrentIds( { ids: args.torrents.pluck('id') } )
      );
    });
  };
  
  return Transmission.extend(Transmission.EventDispatcher, {
    requestAllTorrentIds: requestAllTorrentIds
  });
}; })();

Transmission.Remote.URL = '<%= RPC_URL %>';
