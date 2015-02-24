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

var fs = require('fs');
var _ = require('lodash');
var assert = require('assert');
var compiler = require('../../main')();



describe('environment test', function() {

  it('should correctly compile local', function(done){
    compiler.compile(__dirname + '/../fixture/stgprod', 'local', function(err, system) {
      assert(!err);
      var cd = _.find(system.containerDefinitions, function(cdef) { return cdef.name === 'docsrv'; });
      assert(cd);
      done();
    });
  });

  it('should compile local with overrides', function(done){
    compiler.compile(__dirname + '/../fixture/stgprod', 'local', function(err, system) {
      assert(!err);
      var cd = _.find(system.containerDefinitions, function(cdef) { return cdef.name === 'docsrv'; });
      assert.equal(cd.type, 'process');
      assert.equal(cd.override, undefined);
      done();
    });
  });

  it('should correctly compile staging', function(done){
    compiler.compile(__dirname + '/../fixture/stgprod', 'staging', function(err, system) {
      assert(!err);
      var cd = _.find(system.containerDefinitions, function(cdef) { return cdef.name === 'docsrv'; });
      assert.equal(cd.type, 'docker');
      assert.equal(cd.override, undefined);
      assert(cd);
      done();
    });
  });

  it('should correctly compile production', function(done){
    compiler.compile(__dirname + '/../fixture/stgprod', 'production', function(err, system) {
      assert(!err);
      var cd = _.find(system.containerDefinitions, function(cdef) { return cdef.name === 'docsrv'; });
      assert(cd);
      done();
    });
  });

  it('should correctly compile all targets', function(done){
    compiler.compileAll(__dirname + '/../fixture/stgprod', function(err, results) {
      assert(!err);
      //var cd = _.find(system.containerDefinitions, function(cdef) { return cdef.name === 'docsrv'; });
      //assert(cd);
      done();
    });
  });
});

