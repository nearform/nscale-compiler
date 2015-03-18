var _ = require('lodash');
var assert = require('assert');
var lint = require('../../lint')();

describe('linter test', function() {

	it('should lint using the default .jshintrc', function(done) {
		var system = __dirname + '/../fixture/system2';
		lint(system + '/definitions/services.js', system, function(err, result) {
			assert(!err);
			assert(result.localConfig === false);
			done();
		});
	});
	
	it('should lint using a system specific .jshintrc', function(done) {
		var system = __dirname + '/../fixture/lintTest';
		lint(system + '/definitions/good-syntax.js', system, function(err, result) {
			assert(!err);
			assert(result.localConfig === true);
			done();
		});
	});

	it('should return no errors when linting', function(done) {
		var system = __dirname + '/../fixture/lintTest';
		lint(system + '/definitions/good-syntax.js', system, function(err, result) {
			assert(!err);
			assert(!result.err);
			done();
		});
	});

	it('should return errors because of missing semicolons', function(done) {
		var system = __dirname + '/../fixture/lintTest';
		lint(system+ '/definitions/bad-syntax.js', system, function(err, result) {
			assert(!err);
			assert(result.err);
			done();
		});
	});

});