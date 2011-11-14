var fs = require('fs');

var config = {};

this.configure = function (viewExtension, appRoot, routes) {
    config.viewExtension = viewExtension;
    config.appRoot = appRoot;
    config.routes = routes || [];
}

this.router = function (app) {
    for (var index in config.routes) {
        var route = config.routes[index];
        if (route[0] == 'map') {
            // custom routes
            var method = route[1],
                path = route[2],
                controllerName = route[3],
                actionName = route[4];
            app[method].apply(null, [path, mappedResponse(controllerName, actionName)]);
        } else {
            // default routes
            var method = route[0],
                path = route[1];
            app[method].apply(null, [path, function (req, res) {
                var controller = req.params.controller || "index";
                var action = req.params.action || "index";
                callController(controller, action, req, res);
            }]);
        }
    }
};

function mappedResponse(controllerName, actionName) {
    return function (req, res) {
        callController(controllerName, actionName, req, res);
    };
}

function callController(controllerName, functionName, req, res) {
    var controller = require(config.appRoot+'/controllers/' + controllerName + "Controller");
    var connection = {
        'req': req,
        'res': res
    };
    controller[functionName].apply(null, [connection, createControllerCallback(controllerName, req, res)]);
}

function createControllerCallback(controllerName, req, res) {
    return function (viewReturned, contentType) {
        if (typeof (viewReturned) == 'object' && !(viewReturned instanceof Array)) {
            console.error("Road.js - exception on page:" + req.url);
        } else {
            renderView(controllerName, viewReturned, contentType, req, res);
        }
    }
}

function renderView(controllerName, viewOptions, contentType, req, res) {
    if (viewOptions.constructor === Array) {
        // viewOptions = [ viewFile, [,data] ]
        var cType = contentType || 'text/html';
        res.header("Content-Type", cType);

        if (!viewOptions[1]) viewOptions[1] = {};
        viewOptions[1].layout = false;

        var viewFile = controllerName + '/' + viewOptions[0] + '.' + config.viewExtension;
        res.render(viewFile, viewOptions[1]);
    } else {
        // plain string passed
        var cType = contentType || 'text/plain';
        res.writeHead(200, {
            'Content-Type': cType
        });
        res.end(viewOptions);
    }
}