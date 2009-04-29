/**
 * @fileoverview
 * jsUnitAjax.js contains a mock implementation of XmlHttpRequest that can be used for testing the sending and receiving
 * AJAX requests and responses.
 */

/**
 * @class
 * A MockXmlHttpRequest implements the XmlHttpRequest API.  It is intended for use when testing code that deals with AJAX.
 */
function MockXmlHttpRequest() {
    /**
     * stores the headers set on the request
     */
    this.requestHeaderNamesToValues = {};
    this._serverResponseSet = false;
    this._serverResponseBody = undefined;
    this._serverResponseHeaders = {};
    this._serverResponseStatus = 200;
}

/**
 * Implements open by storing all the arguments
 * @param method
 * @param url
 * @param isAsync
 * @param userName
 * @param password
 */
MockXmlHttpRequest.prototype.open = function(method, url, isAsync, userName, password) {
    this.method = method;
    this.url = url;
    this.isAsync = isAsync;
    this.userName = userName;
    this.password = password;
};

/**
 * Implements send by noting that send was called and storing the data given
 * @param data
 */
MockXmlHttpRequest.prototype.send = function(data) {
    this.sendCalled = true;
    this.data = data;
    
    if (this._serverResponseSet) {
        this.readyState = 4;
        this.status = this._serverResponseStatus;
        this.responseText = this._serverResponseBody;
        this.onreadystatechange();
    }
};

/**
 * Implements setRequestHeader by storing each header and its value in a hash
 * @param label
 * @param value
 */
MockXmlHttpRequest.prototype.setRequestHeader = function(label, value) {
    this.requestHeaderNamesToValues[label] = value;
};

/** Implements getResponseHeader by returning mock values stored before-hand by the tester
  @param name
**/
MockXmlHttpRequest.prototype.getResponseHeader = function(name) {
  if (this.sendCalled) {
    return this._serverResponseHeaders[name];
  }
};



// Methods for priming mock
MockXmlHttpRequest.prototype.serverResponds = function(responseBody, responseStatus) {
    if (undefined === responseStatus) { responseStatus = 200; }
    this._serverResponseSet = true;
    // Sets response body to be returned when send is invoked
    this._serverResponseBody = responseBody;
    this._serverResponseStatus = responseStatus;
    return this;
};

MockXmlHttpRequest.prototype.serverRespondsJSON = function(responseBody, responseStatus) {
    if (undefined === responseStatus) { responseStatus = 200; }
    this.serverResponseHeader('Content-type', 'application/json');
    this.serverResponds(Object.toJSON(responseBody), responseStatus);
    return this;
};

MockXmlHttpRequest.prototype.serverResponseHeader = function(name, value) {
  this._serverResponseHeaders[name] = value;
  return this;
};
