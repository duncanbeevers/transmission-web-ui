//= require <transmission>
//= require <torrent_events>

/* Trasmission.Remote is responsible for transmitting messages to the rpc server
    and ferrying the responses back to interested parties.
*/
Transmission.RemoteEvent = Transmission.Events(
  'RequestedAllTorrentIds', 'ReceivedAllTorrentIds',
  'ReceivedFields', 'ReceivedTorrentFields', 'InvalidSessionId');

Transmission.Remote = (function() {
  var transmission_session_id;
  
  var rpc = function(data, callback) {
    var remote = this,
        url = this.config.RPC_URL;
    if (!url) { return; }
    
    var requestHeaders = {};
    requestHeaders[Transmission.Remote.X_TRANSMISSION_SESSION_ID] = transmission_session_id;
    
    new Ajax.Request(url, {
      postBody: Object.toJSON(data),
      requestHeaders: requestHeaders,
      onSuccess: function(response) {
        var json = response.responseJSON;
        if ('success' === json.result) {
          callback(json.arguments);
        }
      },
      on409: function(response) {
        var header_session_id = response.getHeader(Transmission.Remote.X_TRANSMISSION_SESSION_ID);
        // TODO: if (header_session_id && header_session_id != transmission_session_id)
        // handle case where transmission daemon sends 409 and session already matches
        if (header_session_id) {
          transmission_session_id = header_session_id;
          remote.dispatchEvent(new Transmission.RemoteEvent.InvalidSessionId());
          rpc.bind(remote)(data, callback);
        }
      }
    });
  };
  
  var torrentGet = function(args, callback) {
    rpc.bind(this)({ method: 'torrent-get', arguments: args }, callback);
  };
  
  var requestFields = function(ids, fields) {
    torrentGet.bind(this)({
      ids: ids, fields: fields.concat('id')
    }, function(args) {
      var torrents_data = args.torrents;
      this.dispatchEvent(
        new Transmission.RemoteEvent.ReceivedFields({ torrents_data: torrents_data })
      );
      for (var i = torrents_data.length - 1; i >= 0; i--) {
        this.dispatchTorrentEvent(
          new Transmission.RemoteEvent.ReceivedTorrentFields({ torrent_data: torrents_data[i] })
        );
      }
    }.bind(this));
  };
  
  var groupedRequestFields = function(ids, fields) {
    var isSameFields = function(g) { return fields === g.fields; },
        request_fields_groups = this.request_fields_groups,
        group = request_fields_groups.find(isSameFields),
        queue_duration = this.config.GROUPED_REQUEST_FIELDS_INTERVAL;
    
    if (group) {
      group.ids = group.ids.concat(ids).uniq();
    } else {
      group = { fields: fields, ids: ids };
      var requestFieldsFn = (function(group) { return function() {
        requestFields.bind(this)(group.ids, group.fields);
        clearTimeout(group.timeout);
        this.request_fields_groups = this.request_fields_groups.reject(isSameFields);
      }.bind(this); }.bind(this));
      
      group.timeout = setTimeout(requestFieldsFn(group), queue_duration);
      request_fields_groups.push(group);
    }
  };
  
  var requestAllTorrentIds = function() {
    this.dispatchEvent(new Transmission.RemoteEvent.RequestedAllTorrentIds());
    
    var callback = function(args) {
      var event = new Transmission.RemoteEvent.ReceivedAllTorrentIds({ ids: args.torrents.pluck('id') });
      this.dispatchEvent(event);
    }.bind(this);
    
    torrentGet.bind(this)({ fields: [ 'id' ] }, callback);
  };
  
  var constructor = function(config) {
    this.config = config;
    this.request_fields_groups = [];
  };
  
  constructor.prototype = Transmission.extend(new Transmission.TorrentEventDispatcher(), {
    requestAllTorrentIds: requestAllTorrentIds,
    requestFields: requestFields,
    groupedRequestFields: groupedRequestFields
  });
  
  constructor.X_TRANSMISSION_SESSION_ID = 'X-Transmission-Session-Id';
  
  return constructor;
  
})();
