/**
  Prototypal Inheritance builder
  based on Douglas Crockford's article http://javascript.crockford.com/prototypal.html
  
  Create inheritance heirarchies by providing chains of objects to act as guides.
  
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
