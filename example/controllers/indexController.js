/*
*	Each controller method recieves `req`, `res` and `callback` as parameters. 
*   Although you have access to `res`, `callback` offers shortcuts for rendering the view
*   (see examples below)
*/

// serving a static view
this.get_index = function(req, res, callback) {
    callback(['index']);
}

// serving a view with dynamic content
this.get_dynamicView = function(req, res, callback) {
    callback(['dynamic',{name: "Road.js"}]);
}

// serving view with custom MIME type (default is text/html)
this.get_dynamicViewAsPlainText = function(req, res, callback) {
    callback(['dynamic', {name:'Road.js'}], 'text/plain');
}

// serving plain text
this.get_plainText = function(req, res, callback) {
    callback('Plain text served as text/plain');
}

// serving text in a custom MIME type (default is text/plain)
this.get_plainTextAsJS = function(req, res, callback) {
    callback('var foo = "bar";', 'application/javascript');
}

// custom URL mapping
this.get_custom = function(req, res, callback) {
	callback('custom URL mapping');
}
