//= require <transmission>
//= require <events>

/* Trasmission.Remote is responsible for transmitting messages to the rpc server
    and ferrying the responses back to interested parties.
*/
Transmission.RemoteEvent = Transmission.Events('RequestedAllTorrentIds', 'ReceivedAllTorrentIds', 'ReceivedFields');

Transmission.Remote = (function() { return function(url) {
  var rpc = function(data, callback) {
    if (!url) { return; }
    
    new Ajax.Request(url, {
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
  
  var requestFields = function(ids, fields) {
    torrentGet({
      ids: ids, fields: fields.concat('id')
    }, function(args) {
      remote.dispatchEvent(
        new Transmission.RemoteEvent.ReceivedFields({ torrents_data: args.torrents })
      );
    });
  };
  
  var requestAllTorrentIds = function() {
    this.dispatchEvent(
      new Transmission.RemoteEvent.RequestedAllTorrentIds()
    );
    var remote = this;
    torrentGet({
      fields: [ 'id' ]
    }, function(args) {
      remote.dispatchEvent(
        new Transmission.RemoteEvent.ReceivedAllTorrentIds( { ids: args.torrents.pluck('id') } )
      );
    });
  };
  
  var remote = Transmission.extend(Transmission.EventDispatcher, {
    requestAllTorrentIds: requestAllTorrentIds,
    requestFields: requestFields
  });
  
  return remote;
}; })();
