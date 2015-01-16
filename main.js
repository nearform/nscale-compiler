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

var async = require('async');
var cmp = require('./compile')();
var map = require('./map')();
var editor = require('./edit')();



module.exports = function() {


  /**
   * compile a full abstract system definition
   *
   * path - path to the defintion files
   * platform - the platform to compile to
   * cb - callback
   */
  var compile = function compile(path, platform, cb) {
    cmp.compile(path, platform, function(err, abstractSystem) {
      if (err) { return cb(err); }
      map.map(path, platform, abstractSystem, function(err, system) {
        if (err) { return cb(err); }
        system.topology.name = platform;
        cb(null, system);
      });
    });
  };



  /**
   * compile all targets
   */
  var compileAll = function compile(path, cb) {
    var results = {};
    cmp.targetList(path, function(err, targets) {
      if (err) { return cb(err); }
        async.eachSeries(targets, function(target, done) {
          cmp.compile(path, target, function(err, abstractSystem) {
            if (err) { return cb(err); }
            map.map(path, target, abstractSystem, function(err, system) {
              if (err) { return cb(err); }
              system.topology.name = target;
              results[target] = system;
              done();
            });
          });
        }, function() {
        cb(null, results);
      });
    });
  };



  var listTargets = function listTargets(path, cb) {
    cmp.targetList(path, function(err, targets) {
      cb(err, targets);
    });
  };



  var edit = function(path, command, data, cb) {
    editor.edit(path, command, data, cb);
  };



  return {
    compile: compile,
    compileAll: compileAll,
    listTargets: listTargets,
    edit: edit
  };
};
 

