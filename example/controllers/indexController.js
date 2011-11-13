
// serving a static view
this.index = function(conn, callback) {
    callback(['index']);
}

// serving a view with dynamic content
this.dynamicView = function(conn, callback) {
    callback(['dynamic',{name: "Road.js"}]);
}

// serving view with custom MIME type (default is text/html)
this.dynamicViewAsPlainText = function(conn, callback) {
    callback(['dynamic', {name:'Road.js'}], 'text/plain');
}

// serving plain text
this.plainText = function(conn, callback) {
    callback('Plain text served as text/plain');
}

// serving text in a custom MIME type (default is text/plain)
this.plainTextAsJS = function(conn, callback) {
    callback('var foo = "bar";', 'application/javascript');
}
