//= require <transmission>
/**
  Prototypal Inheritance builder
  based on Douglas Crockford's article http://javascript.crockford.com/prototypal.html
  
  Provide a list of objects to string together in a prototypal inheritance chain.
  
  A, B, C
  
  C.prototype = B
  B.prototype = A
  
  Methods defined on objects later in the list take precedence over
  those defined earlier.
  
**/
Transmission.extend = function() {
  var f = function(mom, baby) {
    function F(p) {
      return Object.extend(this, p);
    };
    F.prototype = mom;
    var n = new F(baby);
    return n;
  };
  
  var o = {};
  for (var i = arguments.length - 1; i >= 0; i--) {
    o = f(arguments[i], o);
  }
  return o;
};
