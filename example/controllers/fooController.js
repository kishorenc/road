/*
*	Each controller method recieves `req`, `res` and `callback` as parameters.
*   Although you have access to `res`, `callback` offers shortcuts for rendering the view
*/

this.get_index = function(req, res, callback) {
    callback(null, 'index');
};

this.get_bar = function(req, res, callback) {
    callback(null, 'bar');
};

this.post_baz = function(req, res, callback) {
	callback(null, {'text/plain': req.params.id});
};

this.put_baz = function(req, res, callback) {
	callback(null, {'text/plain': req.params.id});
};

this.delete_baz = function(req, res, callback) {
	callback(null, {'text/plain': req.params.id});
};

this.get_redirectTarget = function(req, res, callback) {
	callback(null, {'text/plain': 'target page'});
};

this.get_redirectDefault = function(req, res, callback) {
	callback(null, {'redirect': '/foo/redirectTarget'});
};

this.get_redirectWith302 = function(req, res, callback) {
	callback(null, {'redirect': '/foo/redirectTarget'}, 302);
};

this.get_redirectWith301 = function(req, res, callback) {
	callback(null, {'redirect': '/foo/redirectTarget'}, 301);
};

this.get_contentNegotiation = function(req, res, callback) {
	var names = ['Jack', 'Jane'];
	switch(req.format) {
		case 'json':
			callback(null, {'json': names});
			break;
		case 'html':
			var html = '<strong>Jack, Jane</strong>';
			callback(null, {'text/html': html});
			break;
		default:
			callback(new Error('Unsupported content type.'));
	}
};