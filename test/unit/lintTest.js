var assert = require('assert');
var lint = require('../../lint')();

describe('linter test', function() {

  it('should lint using the default .jshintrc', function(done) {
    var system = __dirname + '/../fixture/lintTest/global-config';
    lint(system + '/good-syntax.js', system, function(err, result) {
      assert(!err);
      assert(!result.localConfig);
      done();
    });
  });

  it('should report errors using the default .jshintrc', function(done) {
    var system = __dirname + '/../fixture/lintTest/global-config';
    lint(system + '/bad-syntax.js', system, function(err, result) {
      assert(!err);
      assert(!result.localConfig);
      assert(result.err);
      done();
    });
  });

  it('should lint using the local .jshintrc', function(done) {
    var system = __dirname + '/../fixture/lintTest/local-config';
    lint(system + '/good-syntax.js', system, function(err, result) {
      assert(!err);
      assert(result.localConfig);
      done();
    });
  });

  it('should not report errors using the local .jshintrc', function(done) {
    var system = __dirname + '/../fixture/lintTest/local-config';
    lint(system + '/bad-syntax.js', system, function(err, result) {
      assert(!err);
      assert(result.localConfig);
      assert(!result.err);
      done();
    });
  });
});