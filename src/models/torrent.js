//= require <transmission>
//= require <torrent_file>
//= require <events>

Transmission.Torrent = (function() {
  var getId = function() { return this.id; };
  
  var getFiles = function() { return this.files; };
  
  var updateFiles = function(attribute, attributes) {
    var files = attributes[attribute];
    if (this.files.length < files.length) {
      var torrent = this;
      this.files = files.map(function() {
        return new Transmission.TorrentFile(torrent);
      });
    }
    for (var i = 0, len = files.length; i < len; i++) {
      this.files[i].updateAttributes(files[i]);
    }
  };
  
  var constructor = function(id) {
    initialize.bind(this)(id);
  };
  
  var initialize = function(id) {
    this.id         = id;
    this.files      = [];
    this.addAttributeEventListener('files', updateFiles.curry('files').bind(this));
    this.addAttributeEventListener('fileStats', updateFiles.curry('fileStats').bind(this));
  };
  
  constructor.prototype = Transmission.extend(Transmission.AttributeEventDispatcher.prototype, {
    getId: getId,
    getFiles: getFiles
  });
  
  return constructor;
  
})();
