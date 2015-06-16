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


describe('proxy test', function() {

  it('should correctly inject proxy containers in a basic config', function(done){
    var expected = require('./expectedBasicProxy.json');
    compiler.compile(__dirname + '/../fixture/proxySystem', 'aws', function(err, system) {
      assert(!err);
      assert(system);
      assert(_.isEqual(system, expected));
      done();
    });
  });

  it('should correctly inject proxy containers in a complex config', function(done){
    this.timeout(10000000);
    var expected = require('./expectedComplexProxy.json');
    compiler.compile(__dirname + '/../fixture/proxyFull', 'beta', function(err, system) {
      assert(!err);
      assert(system);
      assert(_.isEqual(system, expected));
      done();
    });
  });
});

