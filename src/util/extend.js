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
  var f = function(o, p) {
    function F() {};
    F.prototype = o;
    return Object.extend(p, new F());
  };
  
  var o = {};
  for (var i = 0, len = arguments.length; i < len; i++) {
    o = f(arguments[i], o);
  }
  return o;
};
