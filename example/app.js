/*
*	Sample app showcasing road
*       Make sure you have express, and ejs installed to run the example
*/

var express = require('express')
    ,road = require('./road');

var app = express.createServer();

road.configure('ejs','routes');
app.configure(function() {
	app.use(express.static(__dirname+'/public'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
    app.use(express.router(road.router));
});

app.error(function(err, req, res, next){
    console.error(err+err.message+err.stack);
    res.send('Error, or not found.');
});

app.listen(5000);
