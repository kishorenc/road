/*
*   Sample app showcasing road
*   Make sure you have express, ejs, and (of course) road installed to run the example
*/

var express = require('express'),
    road = require('road');
    app = express();

road.configure({
    viewEngine: 'ejs',
    routes: require('./routes'),
    useLayout: false,
    callback: roadCallback
});

app.configure(function() {
    app.use(express.static(__dirname+'/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(onError);
});

// initialize road
road(app);

function roadCallback(err, req, res, next) {
    console.log(err, req, res, next);

    if(err) return next(err);
    // else do something, maybe invoke the next middleware...
}

function onError(err, req, res, next){
    console.error(err+err.message+err.stack);
    res.send('Error, or not found.');
};

module.exports = app;
