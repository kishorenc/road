var fs = require('fs');

var config = {};

exports.version = '0.4.0';

var road = module.exports = function(app) {
  for (var index in config.routes) {
    var route = config.routes[index];
    var method = route[0],
        path = route[1],
        controllerName = route[2],
        actionName = route[3];
    app[method](path, mappedResponse(controllerName, actionName));
  }
  // default routes last
  app.all('/:controller?/:id?/:action?.:format?', directResponse());
};

road.configure = function (opts) {
  config.appRoot = process.cwd();
  config.viewExtension = opts.viewEngine || 'jade';
  config.routes = opts.routes || [];
  config.useLayout = (opts.useLayout === undefined) ? false : opts.useLayout;
  config.callback = opts.callback || null;
};

function mappedResponse(controllerName, actionName) {
    return function(req, res, next) {
      callController(controllerName, actionName, req, res, next);
    };
}

function directResponse() {
  return function(req, res, next) {
    var controller = req.params.controller || "index";
    var action = req.params.action, id = req.params.id, format = req.params.format;
    
    if(format === undefined) format = 'html';
    if(action === undefined && id === undefined) {
        action = 'index';
    } else if(action === undefined) {
      // will work for students/:id ???
      action = id;
    }

    req.format = format;
    callController(controller, action, req, res, next);
  };
}

function callController(controllerName, functionName, req, res, next) {
  try {
    var controller = require(config.appRoot+'/controllers/' + controllerName + "Controller");
    var controllerMethod = req.method.toLowerCase()+'_'+functionName;
    controller[controllerMethod](req, res, controllerCallback(controllerName, req, res, next));
  } catch(err) {
    err.status = 404;
    handleCallback(err, req, res, next);
  }
}

function controllerCallback(controllerName, req, res, next) {
  return function (err, view, viewData, contentType) {
    if (err) {
      err.status = err.status || 500;
      return handleCallback(err, req, res, next);
    }
    if(typeof(view) == 'object' && !(view instanceof Array)) {
      redirectOrRenderPlain(req, res, view, viewData, next);
    } else if(typeof(view) == 'string') {
      if(!viewData && !contentType) {
        viewData = {};
        contentType = 'text/html; charset=utf-8';
      } else if(!(viewData && contentType)) {
          if(typeof(viewData) == 'string'){
            contentType = viewData;
            viewData = {};
          } else {
            contentType = 'text/html; charset=utf-8';
          }
      }
      renderRichView(controllerName, view, viewData, contentType, req, res, next);
    } else {
      var parseError = new Error("Road - could not parse your view rendering options.");
      parseError.status = 500;
      return handleCallback(parseError, req, res, next);
    }
  };
}

function redirectOrRenderPlain(req, res, view, viewData, next) {
  for (var cType in view) break;
  switch(cType) {
    case 'redirect':
      if(!viewData || viewData !== 301) viewData = 302;
      res.redirect(viewData, view[cType]);
      handleCallback(null, req, res, next);
      break;
    default:
      renderPlainView(view[cType], cType, req, res, next);
      break;
  }
}

function renderPlainView(content, contentType, req, res, next) {
  if(contentType === 'json') {
    contentType = 'application/json';
    content = JSON.stringify(content);
  }

  res.writeHead(200, {
    'Content-Type': contentType
  });
  res.end(content);
  handleCallback(null, req, res, next);
}

function renderRichView(controllerName, view, viewData, contentType, req, res, next) {
  res.header("Content-Type", contentType);
  var viewFile = controllerName + '/' + view + '.' + config.viewExtension;
  viewData.layout = config.useLayout;
  res.render(viewFile, viewData);
  handleCallback(null, req, res, next);
}

function handleCallback(err, req, res, next) {
  if(config.callback) return config.callback(err, req, res, next);
  else if(err) return next(err);
}
