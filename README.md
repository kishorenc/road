#Road - route helper for Express

A route helper for express that allows you to map routes, controllers and views by following logical conventions. See example application for use cases. You need Express 3.x or Express 2.x and ejs available to run the example.

##Installation

	npm install road

## Express 3.x

The following guide is for Express 3.x. If you using Express 2.x, please refer to the `0.3` branch for instructions.

##Features

	* Wire your routes to individual controllers and views using convention
	* Define custom routes which map custom URLs to specific controller methods	
	* Serve the views in custom MIME types
	* View helper for serving JavaScript objects as application/json
	
##Compatibility

	* Tested with Express 3.x and Express 2.x

##v0.4.0

Road 0.4.x is compatible with Express 3.x. Road also works on Express 2.x, but you have to check the `0.3` branch for instructions.

##Changes in v0.3.x

Road 0.3.x breaks compatibility with 0.2.x with a number of API changes. To upgrade from 0.2.8, see the bottom of this page.
	
See example application for complete use cases.

##Quick Start

Integrating Road with your Express application is really simple.

``` javascript
// create an express app
var app = express();

// initialize road this way
var road = require('road');
road(app);
```

Road, by convention, expects you to drop your controllers into the `controllers` folder in your application root. 

	/controllers
		/indexController.js
		/eventsController.js

You can export your controller functions which automatically get mapped by road, again using convention. Every controller function needs to be prefixed with the HTTP method it's handling. For example, functions serving GET requests, need to be prefixed with `get_`, like this:

``` javascript
// eventsController.js

// maps to: GET events/index or, just GET events/
this.get_index = function(req, res, callback) {
	/* ... */
}

// maps to: GET events/foo/ or, GET events/:id/foo
this.get_foo = function(req, res, callback) {
	/* ... */
}
```

For handling a POST request, use `post_` prefix:

``` javascript
// handles POST events/bar
this.post_bar = function(req, res, callback) {
	/* ... */
}
```	

Instead of using res.render() to render your views, you can use the controller function's `callback`, which provides you with useful shortcuts:

``` javascript
// serves the view file dynamic.ejs, along with the view data
this.get_dynamicView = function(req, res, callback) {
    callback(null, 'dynamic', {name: "Road.js"});
}

// serves a view with custom MIME type (default is text/html)
this.get_dynamicViewAsPlainText = function(req, res, callback) {
    callback(null, 'dynamic', {name:'Road.js'}, 'text/plain');
}

// serving plain text directly (no template)
this.get_plainText = function(req, res, callback) {
    callback(null, {'text/plain': 'Plain text served as text/plain'});
}

// serving a JSON response (served as application/json)
this.get_jsonResponse = function(req, res, callback) {
    var obj = {'foo': 'bar'};
    callback(null, {'json': obj});
}

// for more use cases, see the example app
```

##Content negotation

Road provides a basic mechanism for content negotiation through the use of extension names. If a particular URL is called with an extension, `req.format` property is set the value of the extension. For example, when `foo/show.json` is called, the value of `req.format` will be `json'. Based on this, we can serve different content:

``` javascript
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
```

If the URL is not called with any extension, `req.format` is by default set to `html`.

##Redirection

Road also provides a helper for redirection:

``` javascript
// redirect a request to this controller method to the URL '/foo/redirectTarget'
this.get_redirectDefault = function(req, res, callback) {
	callback(null, {'redirect': '/foo/redirectTarget'});
};
```

Redirections are 302 by default, but you can also explicitly specify a 301 redirect:

``` javascript
this.get_redirectWith301 = function(req, res, callback) {
	callback(null, {'redirect': '/foo/redirectTarget'}, 301);
};
```

##View files

Place your view files in `/views` directory in your application's root. Each controller gets its own sub-directory inside `views`. For example, if you have a `show` method in your `fooController.js`, accessing `foo/show` will make Road look for the template file `views/foo/show.ejs`.

	/controllers
		/fooController.js

	/views
		/foo
			/show.ejs

##Configuration options

**road.configure([options])**

The following properties can be set on the `options` object:

* `viewEngine`: view engine to be used for rendering the views (e.g. ejs, jade). Default: `ejs`
* `routes`: array with custom routing rules (see the following section on routing rules for more details)
* `useLayout`: specifies whether Express should use a layout while rendering the view
* `callback`: this callback will be fired when Road is done with its job

##View helpers

As shown in the examples above, Road provides a wrapper over `res.render` and allows you to render your views by using the `callback` argument passed to your controller method. However, you can simply stick to `res.render` as well for rendering your views. Road uses `ejs` as the default view engine. To specify another view engine, e.g. jade, you can do so via the `viewEngine` configuration property.

``` javascript
road.configure({viewEngine: 'jade'});
```

##Routing rules

Road supports the following routing rule by default:

	/:controller?/:id?/:action?  (for all HTTP verbs)

To define custom routes, place a route file in your application's root. Any routing rule defined in `routes.js` will take precedence over the default routing rules above.

``` javascript
// routes.js (place this in your application root)
module.exports = [
	
	// routes `/path/to/foo` to `get_show()` method of `fooController`
	['get', '/path/to/foo/:id', 'foo', 'show'],

];
```

When you configure Road, you pass these routes using the `routes` property of the configuration options this way:

``` javascript
road.configure({routes: require('./routes')});
```

##Registering a callback

Finally, if you want to register a callback for Road to call when it's done rendering the view (or encounters an error), you can do so like this:

``` javascript
function roadCallback(err, req, res, next) {
	if(err) return next(err);
	// else, do something ...
}
road.configure({callback: roadCallback});
```

Road sets a `status` property on the callback's `err` argument to indicate the type of error. This can be used for rendering an appropriate view with the correct HTTP status code. For missing controller or controller methods, `err.status` is set to 404 (to indicate a missing resource), while any other error passed to Road from a controller method is set to 500. If the error object already has a status set, Road does not override that.

##Upgrading to v0.3.0 from v0.2.8

* Deprecated use of keyword 'map' as the first element in route mapping array. A route mapping is now simply defined as:
    
    ``` javascript
    // routes.js
    module.exports = [
        ['get', '/customPath', 'controllerName', 'methodName'],
    ]
    ```

* `road.configure()` now takes a configuration object.
* `road.use()` is deprecated. To initialize Road, simply pass it to Express this way: `app.use(express.router(road));` 
* Changed the default route convention from `controller/:action/:id` to `controller/:id/:action`

##Running the tests

To run the tests, first install the dev dependencies (ejs, mocha and request):

	$ npm install
	$ npm install -g mocha

Run the tests from the test folder this way:

	$ mocha test.js

##License

(The MIT License)

Copyright (c) 2011-2012 Kishore Nallan  <kishore@kishorelive.com>

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
