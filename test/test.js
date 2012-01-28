process.chdir('../example');

var road = require('../'),
  app = require('../example/app'),
  request = require('request'),
  assert = require('assert');

var port = 3456,
    rootUrl = 'http://localhost:3456/';

describe('Routing with GET', function() {
  
    before(function() {
      app.listen(port);           
    }); 

    after(function() {
      app.close();
    });

    it('should call index method of index controller', function(done){
      request(rootUrl, function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');        
        assert.equal(body, 'Index template: GET /index');
        done();
      });
    });

    it('should call index method of foo controller', function(done){
      request(rootUrl+'foo', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');        
        assert.equal(body, 'Index template: GET foo/index');
        done();
      });
    });

    it('should call bar method of foo controller', function(done){
      request(rootUrl+'foo/bar', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');        
        assert.equal(body, 'Bar template: GET foo/bar');
        done();
      });
    });

    it('should serve a view with dynamic content', function(done) {
      request(rootUrl+'index/dynamicView', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');          
        assert.ok(body.search('<title>Road.js - dynamic content</title>') != -1);
        assert.ok(body.search('<h1>Road for Express</h1>') != -1);
        done();
      });
    });

    it('should serve a view with custom URL mapping defined in routes.js', function(done) {
      request(rootUrl+'customPath', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/plain');          
        assert.equal(body, 'custom URL mapping');        
        done();
      });
    });    
});

describe('POST, PUT & DELETE using req.params.id', function() {
  
    before(function() {
      app.listen(port);           
    }); 

    after(function() {
      app.close();
    });

    it('returns the :id sent to it via POST', function(done) {
      request.post(rootUrl+'foo/baz/42', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/plain');          
        assert.equal(body, '42');        
        done();
      });
    });

    it('returns the :id sent to it via PUT', function(done) {
      request.put(rootUrl+'foo/baz/42', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/plain');          
        assert.equal(body, '42');        
        done();
      });
    });

    it('returns the :id sent to it via DELETE', function(done) {
      request.del(rootUrl+'foo/baz/42', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/plain');          
        assert.equal(body, '42');        
        done();
      });
    });

});

describe('Content Types', function() {
  
    before(function() {
      app.listen(port);           
    }); 

    after(function() {
      app.close();
    });

    it('should serve a view with custom MIME type (text/plain)', function(done) {
      request(rootUrl+'index/dynamicViewAsPlainText', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/plain');          
        assert.ok(body.search('<title>Road.js - dynamic content</title>') != -1);
        assert.ok(body.search('<h1>Road for Express</h1>') != -1);
        done();
      });
    });

    it('should serve a view with custom MIME type (application/javascript)', function(done) {
      request(rootUrl+'index/plainTextAsJS', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'application/javascript');          
        assert.equal(body, 'var foo = "bar";');
        done();
      });
    });

    it('should serve a JSON object as application/json', function(done) {
      request(rootUrl+'index/jsonResponse', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'application/json');          
        assert.equal(body, '{"foo":"bar","baz":[1,2,3]}');
        done();
      });
    });    
});

describe('Handle undefined routes', function() {
  
    var consoleErr = console.error;

    before(function() {
      console.error = function() {};
      app.listen(port);           
    }); 

    after(function() {
      console.error = consoleErr;
      app.close();
    });    

    it('should return an error when an non-existent controller is called', function(done) {            
      request(rootUrl+'nonexistent', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');          
        assert.equal(body, 'Error, or not found.');        
        done();
      });
    });

    it('should return an error when an non-existent controller method is called', function(done) {
      request(rootUrl+'foo/bazinga', function(err, res, body) {
        if(err) throw err;
        assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');          
        assert.equal(body, 'Error, or not found.');
        done();
      });
    });
});



