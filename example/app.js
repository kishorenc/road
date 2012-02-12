/*
*	Sample app showcasing road
*   Make sure you have express, ejs, and (of course) road installed to run the example
*/

var express = require('express'),
	road = require('road');
	app = express.createServer();

app.configure(function() {
	app.use(express.static(__dirname+'/public'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
    app.use(app.router);
});

/*  Configure road:
*   view engine, routes (see routes.js), useLayout?, callback
*/

road.configure('ejs', require('./routes'), false, roadCallback);

// use road to handle the routes this way:
road.router(app);

function roadCallback(err, req, res, next) {
	console.log(err, req, res, next);

	if(err) return next(err);
	// else do something, maybe invoke the next middleware...
}

app.error(function(err, req, res, next){
    console.error(err+err.message+err.stack);
    res.send('Error, or not found.');
});

module.exports = app;
