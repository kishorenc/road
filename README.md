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

Integrating Road with your Express application is really simple. You need a simple route file with atleast the default route defined in your application root.

	// routes.js (place this in your application root)
	module.exports = [
		['all', '/:controller?/:action?/:id?'] // default route
	];

Tell express to let Road handle the routing this way:

	var road = require('road');

	// configure road (view engine, app root, and route module)
	road.configure('ejs', __dirname, require('./routes'));

    app.use(express.router(road.router));

Road, by convention, expects you to drop your controllers into the `controllers` folder in your application root. 

	/controllers
		/indexController.js
		/eventsController.js

You can export your controller methods which automatically get mapped by road, again using convention:

	// eventsController.js

	// maps to: events/index or just events/
	this.index = function(conn, callback) {
    	callback('plain text');
	}

	// maps to events/foo/ or events/foo/:id
	this.foo = function(conn, callback) {
		callback('foo as plain text with optional id ' + conn.req.params.id);
	}

You can access the request and response object by using `conn.req` and `conn.res`. 

	this.bar = function(conn, callback) {
		callback(conn.req.params.id);
	}

The `callback` parameter allows you to serve your views in a number of easy ways:

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
		
		// routes `/path/to/foo` to `show()` method in `fooController`
		['map', 'get', '/path/to/foo', 'foo', 'show'],

		// default route
		['all', '/:controller?/:action?/:id?']
	];


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
