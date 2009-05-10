function() { return {
  setup: function() {
    
  },
  
  teardown: function() {
    
  },
  
  testGetsBehaviors: function() {
    var fn_called = false,
        callFn = function() { fn_called = true; },
        a = { fn: callFn };
    
    var k = Transmission.extend(a);
    k.fn();
    
    this.assert(fn_called);
  },
  
  testGetsMultipleBehaviors: function() {
    var fn1_called = false,
        fn2_called = false,
        callFn1 = function() { fn1_called = true; },
        callFn2 = function() { fn2_called = true; },
        a = { fn1: callFn1 },
        b = { fn2: callFn2 };
    
    var k = Transmission.extend(a, b);
    k.fn1();
    k.fn2();
    
    this.assert(fn1_called);
    this.assert(fn2_called);
  },
  
  testLaterBehaviorsTakePrecedence: function() {
    var fn1_called = false,
        fn2_called = false,
        callFn1 = function() { fn1_called = true; },
        callFn2 = function() { fn2_called = true; },
        a = { fn: callFn1 },
        b = { fn: callFn2 };
    
    var k = Transmission.extend(a, b);
    k.fn();
    
    this.assert(!fn1_called);
    this.assert(fn2_called);
  },
  
  testExtendedObjectsShouldNotHaveOwnPropertiesOfParents: function() {
    var a = { property1: true };
    
    var k = Transmission.extend(a);
    
    this.assert(k.property1);
    this.assert(!k.hasOwnProperty('property1'), 'Should not have own property');
  }
  
}; }
