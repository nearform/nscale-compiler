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

  it('should correctly add a container', function(done){
    compiler.edit(__dirname + '/../fixture/system2', 
                  'addContainer',
                  '{"name": "test123", "type": "process","specific": {"repositoryUrl": "d","buildScript": "g","execute": {"args": "s","exec": "v"}}}',
                  function(err) {
      assert(!err);
      compiler.compile(__dirname + '/../fixture/system2', 'local', function(err, system) {
        assert(!err);
        var cd = _.find(system.containerDefinitions, function(cdef) { return cdef.name === 'test123'; });
        // assert !cd - the container definition will not appear in the compiled JSON because it 
        // is not yet referenced from the topology section
        assert(!cd);
        done();
      });
    });
  });



  it('should correctly link a container', function(done){
    compiler.edit(__dirname + '/../fixture/system2', 
                  'linkContainer',
                  'local/root:test123',
                  function(err, system) {
      assert(!err);
      compiler.compile(__dirname + '/../fixture/system2', 'local', function(err, system) {
        assert(!err);
        var cd = _.find(system.containerDefinitions, function(cdef) { return cdef.name === 'test123'; });
        assert(cd);
        assert(system.topology.containers['test123-b37565a1']);
        done();
      });
    });
  });


  it('should correctly remove a container', function(done){
    compiler.edit(__dirname + '/../fixture/system2', 
                  'removeContainer',
                  'test123',
                  function(err, system) {
      assert(!err);
      compiler.compile(__dirname + '/../fixture/system2', 'local', function(err, system) {
        assert(!err);
        var cd = _.find(system.containerDefinitions, function(cdef) { return cdef.name === 'test123'; });
        assert(!cd);
        assert(!system.topology.containers['test123-c4725537']);
        done();
      });
    });
  });
});

