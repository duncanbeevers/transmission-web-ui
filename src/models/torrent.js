//= require <transmission>
//= require <events>

Transmission.Torrent = (function() { return function(id) {
  var files;
  var getId = function() { return id; };
  var getFiles = function() { return files; };
  
  return {
    getId: getId,
    getFiles: getFiles
  };
}; })();
