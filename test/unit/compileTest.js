/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

var _ = require('lodash');

var assert = require('assert');
var compiler = require('../../main')();


describe('compiler test', function() {

  it('should correctly compile a system definition for local', function(done){
    this.timeout(1000000);
    var expected = require('./expectedLocal.json');
    compiler.compile(__dirname + '/../fixture/system2', 'local', function(err, system) {
      assert(!err);
      assert(system);
      assert(_.isEqual(system, expected));
      done();
    });
  });

  it('should correctly compile a system definition for aws', function(done){
    var expected = require('./expectedAws.json');
    compiler.compile(__dirname + '/../fixture/system2', 'aws', function(err, system) {
      assert(!err);
      assert(system);
      assert(_.isEqual(system, expected));
      done();
    });
  });

  it('should correctly compile a blank empty system definition for local', function(done){
    var expected = require('./expectedBlank.json');
    compiler.compile(__dirname + '/../fixture/blank', 'local', function(err, system) {
      assert(!err);
      assert(system);
      assert(_.isEqual(system, expected));
      done();
    });
  });

  it('should correctly compile a system definition for islab', function(done){
    var expected = require('./expectedIsLab.json');
    compiler.compile(__dirname + '/../fixture/islab', 'direct', function(err, system) {
      assert(!err);
      assert(system);
      assert(JSON.stringify(expected) === JSON.stringify(system));
      done();
    });
  });

  it('should refuse to compile if types are missing', function(done){
    compiler.compile(__dirname + '/../fixture/noType', 'local', function(err, system) {
      assert(err);
      assert(!system);
      done();
    });
  });

  it('should not add spurious containers', function(done){
    var base = __dirname + '/../fixture/sudc-direct';
    var expected = require(base + '/expected.json');
    compiler.compile(__dirname + '/../fixture/sudc-direct', 'direct', function(err, system) {
      assert(!err);
      assert(system);
      assert(JSON.stringify(system) === JSON.stringify(expected));
      done();
    });
  });

  it('should handle JS errors', function(done){
    compiler.compile(__dirname + '/../fixture/jserrors', 'direct', function(err) {
      assert(err.result === 'err');
      assert(err.err[0].indexOf('error: Duplicate key') !== -1);
      done();
    });
  });

  it('should not compile a system with a missing definition', function(done){
    compiler.compile(__dirname + '/../fixture/missing', 'direct', function(err) {
      assert.equal(err.message, 'unable to compile');
      assert(err.reasons[0].indexOf('undefined element') !== -1);
      done();
    });
  });

  it('should ignore non-js files', function(done){
    compiler.compile(__dirname + '/../fixture/non-js-files', 'direct', function(err) {
      assert(!err);
      done();
    });
  });

  it('should correctly compile all targets', function(done){
    var expectedLocal = require('./expectedLocal.json');
    var expectedAws = require('./expectedAws.json');
    compiler.compileAll(__dirname + '/../fixture/system2', function(err, systems) {
      assert(!err);
      assert(systems);
      assert(_.isEqual(systems.local, expectedLocal));
      assert(_.isEqual(systems.aws, expectedAws));
      done();
    });
  });

  describe('Given a system with two identical topologies', function () {
    it('should generate two systems with different container names', function (done) {
      compiler.compileAll(__dirname + '/../fixture/multipleIdenticalTopologies', function (err, systems) {
        assert(!err);
        assert(systems);
        systems.local.topology.name = 'fakename';
        systems.aws.topology.name = 'fakename';
        assert(!_.isEqual(systems.local.topology, systems.aws.topology));
        done();
      });
    });
  });

  it('should not compile a system with a double definition', function(done){
    compiler.compile(__dirname + '/../fixture/doubledef', 'direct', function(err) {
      assert(err, 'compile should error');
      assert.equal(err.message, 'unable to compile');
      assert.equal(err.reasons[0], 'definition web already added');
      done();
    });
  });
});


