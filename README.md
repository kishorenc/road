#Road

A route helper for express that allows you to map routes, controllers and views by following logical conventions. See example application for use cases. You need express and ejs available to run the example.

##Installation

	npm install road

##Features

	* Wire your routes to individual controllers and views using convention
	* Serve the views in custom MIME types
	* Define custom routes which map custom URLs to specific controller methods
	
See example application for complete use cases.

#Quick Start

Integrating Road with your Express application is really simple. You need an empty route file defined in your application root.

	// routes.js (place this in your application root)
	module.exports = [];

Tell express to let Road handle the routing this way:

	var road = require('road');

	// configure road by specifying the view engine and the routes
	road.configure('ejs', require('./routes'));

	// mount application routes using road
	road.router(app);

Road, by convention, expects you to drop your controllers into the `controllers` folder in your application root. 

	/controllers
		/indexController.js
		/eventsController.js

You can export your controller functions which automatically get mapped by road, again using convention. Every controller function needs to be prefixed with the HTTP method it's handling. For example, functions which are serving GET requests, need to be prefixed with 'get_', like this:

	// eventsController.js

	// maps to: GET events/index or, just GET events/
	this.get_index = function(req, res, callback) {
    	callback('plain text');
	}

	// maps to: GET events/foo/ or, GET events/foo/:id
	this.get_foo = function(req, res, callback) {
		callback('foo as plain text with optional id ' + req.params.id);
	}

	// handling POST request: POST events/bar
	this.post_bar = function(req, res, callback) {
		callback(req.params.id);
	}

The `callback` parameter allows you to serve your views in a number of easy ways:

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

	// more use cases in example app

Place your views in `/views` in app root. Each controller gets its own sub-directory inside `views`. For example, if you have a `show` method in your `fooController.js`, accessing `foo/show` will make Road look for the template file `views/foo/show.ejs`.

	/controllers
		/fooController.js

	/views
		/foo
			/show.ejs

Road also supports custom routes.

	// routes.js
	module.exports = [
		
		// routes `/path/to/foo` to `get_show()` method in `fooController`
		['map', 'get', '/path/to/foo', 'foo', 'show'],

	];

##Todo

	* Refer to issues


##License

(The MIT License)

Copyright (c) 2011 Kishore Nallan  <kishore@kishorelive.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
