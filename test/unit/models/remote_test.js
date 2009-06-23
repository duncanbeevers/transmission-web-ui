function() {
  var fixtureTorrentData1 = {
      id: 1,
      files: [ {
        bytesCompleted: 13543923,
        length: 13543924,
        name: "Flight of the Knife 320\/01 Flight of the Knife (Part One).mp3"
      } ]
    };

return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testMissingXTransmissionSessionId: function() {
    var transmission_session_id = 'lYLlxjhWbBZxNac9syPk3aND05DNFxUtVO7TIcOYeUtJN9ra',
        
        failed_transport = new MockXmlHttpRequest().
          setServerResponseHeader(Transmission.Remote.X_TRANSMISSION_SESSION_ID, transmission_session_id).
          serverResponds('yada yada', 409),
        
        successful_transport = new MockXmlHttpRequest().
          setServerResponseHeader(Transmission.Remote.X_TRANSMISSION_SESSION_ID, transmission_session_id).
          serverRespondsJSON({ arguments: { torrents: [ { id: 1 } ] }, result: 'success' }, 200);
    
    jack.expect('Ajax.getTransport').exactly(2).returnValues(
      failed_transport,
      successful_transport);
    
    var invalid_session_id_fired, received_all_torrent_ids,
        remote = new Transmission.Remote({ RPC_URL: 'url' });
    
    remote.addEventListener(Transmission.RemoteEvent.InvalidSessionId, function(event) {
      invalid_session_id_fired = true;
    });
    remote.addEventListener(Transmission.RemoteEvent.ReceivedAllTorrentIds, function(event) {
      received_all_torrent_ids = true;
    });
    
    remote.requestAllTorrentIds();
    this.wait(10, function() {
      this.assert(invalid_session_id_fired,
        'Expected invalid session id event to have fired');
      this.assert(received_all_torrent_ids,
        'Expected to have re-requested and received all torrent ids');
      this.assertEqual(transmission_session_id, successful_transport.requestHeaders[Transmission.Remote.X_TRANSMISSION_SESSION_ID],
        'Expected re-request to have used updated session id header');
    });
  },
  
  testGetAllIds: function() {
    var transport = new MockXmlHttpRequest().serverRespondsJSON({
      arguments: {
        torrents: [ { id: 1 } ]
      },
      result: 'success'
    });
    jack.expect('Ajax.getTransport').returnValue(transport);
    
    var expected_command = Object.toJSON({
      method: 'torrent-get',
      arguments: { fields: [ 'id' ] }
    });
    
    var all_ids_requested = false,
        ids = [],
        url = '/specified_url',
        remote = new Transmission.Remote( { RPC_URL: url } );
    
    remote.addEventListener(Transmission.RemoteEvent.RequestedAllTorrentIds, function(event) {
      all_ids_requested = true;
    });
    remote.addEventListener(Transmission.RemoteEvent.ReceivedAllTorrentIds, function(event) {
      ids = event.getData().ids;
    });
    remote.requestAllTorrentIds();
    
    // Wait for events to fire
    this.wait(10, function() {
      this.assertEqual(url, transport.url);
      this.assertEqual(expected_command, transport.data);
      
      this.assertSameElements([ 1 ], ids, 'Expected event to have list of ids');
      this.assert(all_ids_requested);
    });
  },
  
  testRequestFields: function() {
    var remote = new Transmission.Remote( { RPC_URL: 'url' } );
    var expected_torrents_data = [ fixtureTorrentData1 ],
      expected_single_torrent_data = fixtureTorrentData1;
    
    var transport = new MockXmlHttpRequest().serverRespondsJSON({
      arguments: { torrents: expected_torrents_data }, 
      result: "success"
    });
    jack.expect('Ajax.getTransport').returnValue(transport);
    
    var torrents_data = [];
    remote.addEventListener(Transmission.RemoteEvent.ReceivedFields, function(event) {
      torrents_data = event.getData().torrents_data;
    });
    
    var single_torrent_data = {};
    remote.addTorrentEventListener(
      Transmission.RemoteEvent.ReceivedTorrentFields,
      expected_single_torrent_data.id,
      function(event) {
        single_torrent_data = event.getData().torrent_data;
      });
    
    remote.requestFields([ 1 ], [ 'files' ]);
    this.assert(transport.dataJSON().arguments.fields.include('id'),
      'Expected id to have been requested automatically');
    
    this.wait(10, function() {
      // Assert top-level event listener
      for (var i = torrents_data.length - 1; i >= 0; i--) {
        var expected_torrent_data = expected_torrents_data[i],
            torrent_data = torrents_data[i];
        this.assertEqual(expected_torrent_data.id, torrent_data.id);
        for (var j = torrent_data.files.length - 1; j >= 0; j--) {
          var expected_torrent_file_data = expected_torrent_data.files[j],
              torrent_file_data = torrent_data.files[j];
          
          this.assertEqual(expected_torrent_file_data.bytesCompleted, torrent_file_data.bytesCompleted);
          this.assertEqual(expected_torrent_file_data.length, torrent_file_data.length);
          this.assertEqual(expected_torrent_file_data.name, torrent_file_data.name);
        }
      }
      
      // Assert per-torrent event listener
      this.assertEqual(expected_single_torrent_data.id, single_torrent_data.id);
      for (var i = expected_single_torrent_data.files.length - 1; i >= 0; i--) {
        var expected_single_torrent_file_data = expected_single_torrent_data.files[i],
            single_torrent_file_data = single_torrent_data.files[i];
        this.assertEqual(expected_single_torrent_file_data.bytesCompleted, single_torrent_file_data.bytesCompleted);
        this.assertEqual(expected_single_torrent_file_data.length, single_torrent_file_data.length);
        this.assertEqual(expected_single_torrent_file_data.name, single_torrent_file_data.name);
      }
    });
  },
  
  testGroupedRequestFields: function() {
    var requested_fields = [ 'files' ];
    var remote = new Transmission.Remote(
      { RPC_URL: 'url',
        GROUPED_REQUEST_FIELDS_INTERVAL: 20 //ms
      });
    
    var transport = new MockXmlHttpRequest().serverRespondsJSON({
      arguments: { torrents: [ fixtureTorrentData1 ] }, 
      result: "success"
    });
    jack.expect('Ajax.getTransport').exactly(2).returnValue(transport);
    
    remote.groupedRequestFields([ 1 ], requested_fields);
    this.wait(1, function() {
      remote.groupedRequestFields([ 2 ], requested_fields);
      this.wait(40, function() {
        this.assertSameElements( [ 1, 2 ], transport.dataJSON().arguments.ids);
        remote.groupedRequestFields([ 1 ], requested_fields);
        this.wait(40, function() {
          this.assertSameElements( [ 1 ], transport.dataJSON().arguments.ids);
        });
      });
    });
  }
  
}; }
