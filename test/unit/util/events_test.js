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
  },
  
  testGetAttribute: function() {
    var listener = new Transmission.AttributeEventDispatcher();
    listener.updateAttributes({
      'attribute1': 'value1'
    });
    
    this.assertEqual('value1', listener.getAttribute('attribute1'),
      'Expected attribute event dispatcher to track its own attributes');
  },
  
  testGetAttributes: function() {
    var listener = new Transmission.AttributeEventDispatcher();
    var provided_attributes = { 'attribute1': 'value1' };
    listener.updateAttributes(provided_attributes);
    
    this.assertHashEqual(provided_attributes, listener.getAttributes(),
      'Expected all attributes to have been returned');
  },
  
  testAddAttributeEventListener: function() {
    var listener = new Transmission.AttributeEventDispatcher(),
        attribute_updated;
    
    listener.addAttributeEventListener('attribute1', function() {
      attribute_updated = true;
    });
    
    listener.updateAttributes({
      'attribute1': 1
    });
    
    this.wait(10, function() {
      this.assert(attribute_updated,
        'Expected attribute event listener to have fired when observed attribute was updated');
    });
  },
  
  testAttributeEventListenerShouldRequireChangeInValue: function() {
    var listener = new Transmission.AttributeEventDispatcher(),
        attribute_updated = false;
    listener.updateAttributes({ hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcb' });
    
    listener.addAttributeEventListener('hashString', function() {
      attribute_updated = true;
    });
    listener.updateAttributes({ hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcb' });
    this.assert(!attribute_updated);
  },
  
  testAddAttributesEventListener: function() {
    var listener = new Transmission.AttributeEventDispatcher(),
        attribute_update_count = 0,
        passed_attributes;
    listener.addAttributesEventListener([ 'haveUnchecked', 'hashString' ], function(attributes) {
      passed_attributes = attributes;
      attribute_update_count++;
    });
    
    listener.updateAttributes({ hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcb' });
    this.assertEqual(1, attribute_update_count);
    this.assertHashEqual(listener.getAttributes(), passed_attributes);
    
    listener.updateAttributes({ haveUnchecked: 10 });
    this.assertEqual(2, attribute_update_count);
    
    listener.updateAttributes({
      hashString: 'b126e1ea1b49c79613f779ac0f36a9714e823fcc',
      haveUnchecked: 11
    });
    this.assertEqual(3, attribute_update_count);
  }
  
}; }
