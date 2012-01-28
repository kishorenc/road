/*
*	Each controller method recieves `req`, `res` and `callback` as parameters.
*   Although you have access to `res`, `callback` offers shortcuts for rendering the view
*   (see examples below)
*/

// serving a static view
this.get_index = function(req, res, callback) {
    callback(null, 'index');
};

// serving a view with dynamic content
this.get_dynamicView = function(req, res, callback) {
    callback(null, 'dynamic', {name: "Road for Express"});
};

// serving view with custom MIME type (default is text/html)
this.get_dynamicViewAsPlainText = function(req, res, callback) {
    callback(null, 'dynamic', {name:'Road for Express'}, 'text/plain');
};

// serving plain text
this.get_plainText = function(req, res, callback) {
    callback(null, {'text/plain': 'Plain text served as text/plain'});
};

// serving text as JavaScript
this.get_plainTextAsJS = function(req, res, callback) {
    callback(null, {'application/javascript': 'var foo = "bar";'});
};

// custom URL mapping
this.get_custom = function(req, res, callback) {
	callback(null, {'text/plain': 'custom URL mapping'});
};

// serve JSON
this.get_jsonResponse = function(req, res, callback) {
	var obj = {
		foo: 'bar',
		baz: [1,2,3]
	};
	callback(null, {'json': obj});
};