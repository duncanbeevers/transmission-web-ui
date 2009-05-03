function() { return {
  // replace this with your real tests
  setup: function() {
    
  },
  
  teardown: function() {
    
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
        remote = new Transmission.Remote(url);
    
    remote.addEventListener(Transmission.RemoteEvent.RequestedAllTorrentIds, function(event) {
      all_ids_requested = true;
    });
    remote.addEventListener(Transmission.RemoteEvent.ReceivedAllTorrentIds, function(event) {
      ids = event.getData().ids;
    });
    remote.requestAllTorrentIds();
    
    this.assertEqual(url, transport.url);
    this.assertEqual(expected_command, transport.data);
    
    // Wait for events to fire
    this.wait(10, function() {
      this.assertSameElements([ 1 ], ids, 'Expected event to have list of ids');
      this.assert(all_ids_requested);
    }.bind(this));
  },
  
  testRequestFields: function() {
    var remote = new Transmission.Remote('url');
    var transport = new MockXmlHttpRequest().serverRespondsJSON({
      arguments: {
        torrents: [ {
          id: 1,
          files: [ {
            bytesCompleted: 13543923, 
            length: 13543924, 
            name: "Flight of the Knife 320\/01 Flight of the Knife (Part One).mp3"
          } ]
        } ]
      }, 
      result: "success"
    });
    jack.expect('Ajax.getTransport').returnValue(transport);
    
    var torrent_data = {};
    remote.addEventListener(Transmission.RemoteEvent.ReceivedFields, function(event) {
      torrent_data = event.getData().torrent_data;
    });
    remote.requestFields(1, [ 'files' ]);
    this.assert(transport.dataJSON().arguments.fields.include('id'),
      'Expected id to have been requested automatically');
    
    // Bah, this is kind of lame
    this.wait(10, function() {
      this.assertEqual(1, torrent_data.id);
      this.assertEqual(13543923, torrent_data.files[0].bytesCompleted);
      this.assertEqual(13543924, torrent_data.files[0].length);
      this.assertEqual("Flight of the Knife 320\/01 Flight of the Knife (Part One).mp3",
        torrent_data.files[0].name);
    });
  }
  
}; }
