function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testEventType: function() {
    var event_type = Transmission.EventType('EndOfWorld');
    
    this.assertEqual('EndOfWorld', event_type.getName(),
      'Expected EventType to know its name');
    
    var event = new event_type('Food for thought');
    
    this.assertEqual('EndOfWorld', event.getName());
    this.assertEqual('Food for thought', event.getData());
    this.assertEqual(event_type.getType(), event.getType());
  },
  
  testBulkCreateEventTypes: function() {
    var namespace = Transmission.Events('Coronary', 'Thrombosis');
    this.assert(namespace.Coronary);
    this.assert(namespace.Thrombosis);
  },
  
  testAddEventListener: function() {
    var namespace = Transmission.Events('LevelUp');
    
    var listener = new Transmission.EventDispatcher(),
        received_data;
    
    listener.addEventListener(namespace.LevelUp, function(event) {
      received_data = event.getData();
    });
    
    var event_data = { key1: 'value' };
    
    listener.dispatchEvent(new namespace.LevelUp(event_data));
    
    this.wait(10, function() {
      this.assertIdentical(event_data, received_data);
    });
  },
  
  testAddEventsAreDispatchedPerInstance: function() {
    var namespace = Transmission.Events('LevelUp');
    
    var dispatcher1 = new Transmission.EventDispatcher(),
        dispatcher2 = new Transmission.EventDispatcher(),
        dispatcher1_fired = false,
        dispatcher2_fired = false;
    dispatcher1.addEventListener(namespace.LevelUp, function() { dispatcher1_fired = true; });
    dispatcher2.addEventListener(namespace.LevelUp, function() { dispatcher2_fired = true; });
    
    dispatcher1.dispatchEvent(new namespace.LevelUp());
    this.wait(100, function() {
      this.assert(dispatcher1_fired, 'Expected dispatcher to have executed callback for event sent to first dispatcher');
      this.assert(!dispatcher2_fired, 'Expected 2nd dispatcher not to executed callback for event sent to first dispatcher');
    });
  }
  
}; }
