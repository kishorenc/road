var fs = require('fs');

var config = {};

this.configure = function (viewExtension, routes, useLayout) {
  config.viewExtension = viewExtension;
  config.appRoot = process.cwd();
  config.routes = routes || [];
  config.useLayout = (useLayout === undefined) ? false : useLayout;
  config.routes.push(['all', '/:controller?/:action?/:id?']);
}

this.router = function (app) {
  for (var index in config.routes) {
    var route = config.routes[index];
    if (route[0] == 'map') {
      var method = route[1],
          path = route[2],
          controllerName = route[3],
          actionName = route[4];
      app[method](path, function (req, res) { 
          callController(controllerName, actionName, req, res)
      });
    } else {
      var method = route[0],
          path = route[1];
      app[method](path, function (req, res) {
          var controller = req.params.controller || "index";
          var action = req.params.action || "index";
          callController(controller, action, req, res);
      });
    }
  }
};

function callController(controllerName, functionName, req, res) {
  var controller = require(config.appRoot+'/controllers/' + controllerName + "Controller");
  var controllerMethod = req.method.toLowerCase()+'_'+functionName;
  controller[controllerMethod](req, res, controllerCallback(controllerName, req, res));
}

function controllerCallback(controllerName, req, res) {
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
    // viewOptions : [ viewFile, [,data] ]
    var cType = contentType || 'text/html';
    res.header("Content-Type", cType);

    if (!viewOptions[1]) viewOptions[1] = {};
    viewOptions[1].layout = config.useLayout;

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