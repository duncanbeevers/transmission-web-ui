/**
  ScriptLoader
  A port of Steve Souder's EFWS
  
**/
ScriptLoader = (function() {
  var main_domain = document.location.protocol + '://' + document.location.host + '/',
      browser = {
        Opera:   navigator.userAgent.indexOf('Opera') > -1,
        Firefox: navigator.userAgent.indexOf('Firefox') > -1
      };
  
  var loadScript = function(url, callback) {
    loadScriptDomElement(url, observerNotifyingCallback(callback));
  };
  var loadScripts = function(urls, callback) {
    var strategy = getBestLoadStrategy(urls);
    
    // Load all but the last url without the final callback
    for (var i = 0, len = urls.length; i < len - 1; i++) {
      strategy(urls[i], null, true);
    }
    
    // Load the last url with the final callback
    strategy(urls[urls.length - 1], callback, true);
  };
  
  
  
  // Helpers
  var isSameDomain = function(url) {
    if (!url.match(/^https?:\/\//)) { return true; }
    return (0 === url.indexOf(main_domain));
  };
  
  var areAllSameDomain = function(urls) {
    for (var i = urls.length - 1; i >= 0; i--) {
      if (!isSameDomain(urls[i])) { return false; }
    }
    return true;
  };
  
  var observer_notified_scripts = {};
  var observers = {};
  var observerNotifyingCallback = function(callback) {
    return function(url) {
      callback.apply(this, arguments);
      
      observer_notified_scripts[url] = true;
      
      if (!observers[url]) { return; }
      for (var i = observers[url].length - 1; i >= 0; i--) {
        observers[url][i]();
      }
    };
  }
  var getBestLoadStrategy = function(urls) {
    return observerNotifyingCallback(getBrowserSpecificLoadStrategy(urls));
  };
  
  var getBrowserSpecificLoadStrategy = function(urls) {
    if (areAllSameDomain(urls)) { return loadScriptXhrInjection; }
    if (browser.Opera || browser.Firefox) { return loadScriptDomElement; }
    return loadScriptDocWrite;
  }
  
  var Ajax = function(url, callback) {
    var transports = [
          function() { return new ActiveXObject('Microsoft.XMLHTTP'); },
          function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
          function() { return new XMLHttpRequest(); }
        ], transport;
    
    for (var i = transports.length - 1; i >= 0; i--) {
      try { xhrObj = transports[i](); }
      catch(_) { continue; }
      break;
    }
    
    transport.onreadystatechange = function() {
      if (4 !== transport.readyState) { return; }
      callback(transport);
      transport.onreadystatechange = null;
    }
    
    transport.open('GET', url, true);
    transport.send('');
  }
  
  
  
  // Loading strategies
  var loadScriptDomElement = function(url, callback) {
    var domscript = document.createElement('script');
    domscript.src = url;
    domscript.onloadDone = false;
    domscript.onload = function() {
      domscript.onloadDone = true;
      callback(url);
    };
    domscript.onreadystatechange = function() {
      if (!domscript.onloadDone && 'loaded' === domscript.readyState) {
        domscript.onloadDone = true;
        domscript.onload();
      }
    };
    document.getElementsByTagName('head')[0].appendChild(domscript);
  };
  
  var loadScriptDocWrite = function(url, callback) {
    var dom_loaded_sigil = '__EFWSonDOMContentLoaded';
    document.write('<scr' + 'ipt src="' + url + '" type="text/javascript"></scr' + 'ipt>');
    
    // we can't tie it to the script's onload, so use Prototype's dom:loaded
    document.write('<script id=' + dom_loaded_sigil + ' defer src=//:><\/script>');
    document.getElementById(dom_loaded_sigil).onreadystatechange = function() {
      if ('complete' !== this.readyState) { return; }
      this.onreadystatechange = null;
      callback(url);
    };
  };
  
  var queued_scripts = [];
  var loadScriptXhrInjection = function(url, callback, preserve_order) {
    var queue_entry;
    if (preserve_order) {
      queue_entry = { url: url, response: null, callback: callback, done: false };
      queued_scripts.push(queue_entry);
    }
    
    Ajax(url, function(transport) {
      if (preserve_order) {
        queue_entry.response = transport.responseText;
        injectScripts();
      } else {
        var se = document.createElement('script');
        document.getElementsByTagName('head')[0].appendChild(se);
        se.text = transport.responseText;
        
        callback(url);
      }
    });
  };
  
  var injectScripts = function() {
    var document_head = document.getElementsByTagName('head')[0];
    for (var i = 0, len = queued_scripts.length; i < len; i++) {
      var script = queued_scripts[i];
      if (!script.done || !script.response) { break; }
      
      var se = document.createElement('script');
      document_head.appendChild(se);
      se.text = qScript.response;
      
      script.callback(script.url);
      script.done = true;
    }
  };
  
  var observe = function(url, callback) {
    if (!observers[url]) { observers[url] = []; }
    
    if (observer_notified_scripts[url]) {
      callback(url);
    } else {
      observers[url].push(callback);
    }
  }
  
  return {
    loadScript: loadScript,
    loadScripts: loadScripts,
    observe: observe
  };
})();
