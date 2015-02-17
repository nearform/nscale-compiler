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
var compiler = require('../../compile')();

describe('parent container test', function() {

  it('should determine the correct parent path', function(done){
    var prnt;

    prnt = compiler.getParentContainer(['root', '0', 'machine', 'contains']);
    assert(prnt.path.length === 3);
    assert(prnt.name === 'machine');

    prnt = compiler.getParentContainer(['root', '0', 'machine', 'contains', '0']);
    assert(prnt.path.length === 3);
    assert(prnt.name === 'machine');

    prnt = compiler.getParentContainer(['root', '0', 'machine', 'contains', '1', 'frontend']);
    assert(prnt.path.length === 3);
    assert(prnt.name === 'machine');

    prnt = compiler.getParentContainer(['root', '0', 'machine', 'contains', '3', 'frontend']);
    assert(prnt.path.length === 3);
    assert(prnt.name === 'machine');

    prnt = compiler.getParentContainer(['root', 'machine', 'contains', 'frontend']);
    assert(prnt.path.length === 2);
    assert(prnt.name === 'machine');

    prnt = compiler.getParentContainer(['root', 'machine', 'frontend']);
    assert(prnt.path.length === 2);
    assert(prnt.name === 'machine');

    prnt = compiler.getParentContainer(['root', 'machine', 'contains', '0', 'frontend']);
    assert(prnt.path.length === 2);
    assert(prnt.name === 'machine');

    done();
  });
});

