var fs = require('fs');

var config = {};

exports.version = '0.1.2';

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
      app[method](path, function (req, res, next) { 
          callController(controllerName, actionName, req, res)
      });
    } else {
      var method = route[0],
          path = route[1];
      app[method](path, function (req, res, next) {
          var controller = req.params.controller || "index";
          var action = req.params.action || "index";
          callController(controller, action, req, res, next);
      });
    }
  }
};

function callController(controllerName, functionName, req, res, next) {
  var controller = require(config.appRoot+'/controllers/' + controllerName + "Controller");
  var controllerMethod = req.method.toLowerCase()+'_'+functionName;
  controller[controllerMethod](req, res, controllerCallback(controllerName, req, res, next));
}

function controllerCallback(controllerName, req, res, next) {
  return function (err, view, viewData, contentType) {
    if (err) return next(err);
    
    if(typeof(view) == 'object' && !(view instanceof Array)) {
      for (var cType in view) break;
      renderPlainView(view[cType], cType, req, res);
    } else if(typeof(view) == 'string') {
      if(!viewData && !contentType) {
        viewData = {};
        contentType = 'text/html';
      } else if(!(viewData && contentType)) {
          if(typeof(viewData) == 'string'){
            contentType = viewData;
            viewData = {};
          } else {
            contentType = 'text/html';         
          }
      }
      renderRichView(controllerName, view, viewData, contentType, req, res);
    } else {
      next(new Error("Road - could not parse your view rendering options."));
    }
  }
}

function renderPlainView(content, contentType, req, res) {
  res.writeHead(200, {
    'Content-Type': contentType
  });
  res.end(content);
}

function renderRichView(controllerName, view, viewData, contentType, req, res) {
  res.header("Content-Type", contentType);
  var viewFile = controllerName + '/' + view + '.' + config.viewExtension;
  viewData.layout = config.useLayout;
  res.render(viewFile, viewData);
}