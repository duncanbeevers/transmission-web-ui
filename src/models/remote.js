//= require <transmission>
//= require <torrent_events>

/* Trasmission.Remote is responsible for transmitting messages to the rpc server
    and ferrying the responses back to interested parties.
*/
Transmission.RemoteEvent = Transmission.Events(
  'RequestedAllTorrentIds', 'ReceivedAllTorrentIds',
  'ReceivedFields', 'ReceivedTorrentFields');

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
      var torrents_data = args.torrents;
      remote.dispatchEvent(
        new Transmission.RemoteEvent.ReceivedFields({ torrents_data: torrents_data })
      );
      for (var i = torrents_data.length - 1; i >= 0; i--) {
        remote.dispatchTorrentEvent(
          new Transmission.RemoteEvent.ReceivedTorrentFields({ torrent_data: torrents_data[i] })
        );
      }
    });
  };
  
  var groupedRequestFields = function(ids, fields) {
    remote.requestFields(ids, fields);
  };
  
  var requestAllTorrentIds = function() {
    remote.dispatchEvent(
      new Transmission.RemoteEvent.RequestedAllTorrentIds()
    );
    torrentGet({
      fields: [ 'id' ]
    }, function(args) {
      remote.dispatchEvent(
        new Transmission.RemoteEvent.ReceivedAllTorrentIds( { ids: args.torrents.pluck('id') } )
      );
    });
  };
  
  var remote = Transmission.extend(Transmission.TorrentEventDispatcher, {
    requestAllTorrentIds: requestAllTorrentIds,
    requestFields: requestFields,
    groupedRequestFields: groupedRequestFields
  });
  
  return remote;
}; })();
