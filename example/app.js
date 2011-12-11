/*
*	Sample app showcasing road
*   Make sure you have express, ejs, and (of course) road installed to run the example
*/

var express = require('express'),
	app = express.createServer();

var road = require('road');

// configure road by specifying: 
// view engine, routes (see routes.js), and whether layout should be used
road.configure('ejs', require('./routes'), false);

app.configure(function() {
	app.use(express.static(__dirname+'/public'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

    app.use(app.router);
});

// use road to handle the routes this way:
road.router(app);

app.error(function(err, req, res, next){
    console.error(err+err.message+err.stack);
    res.send('Error, or not found.');
});

app.listen(5000);
