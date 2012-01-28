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