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
var traverse = require('traverse');
var crc = require('crc');
var lint = require('./lint')();



/*
 * compilation process is:
 *
 * load all container defs
 * load the topology tree
 * build the abstract system definition json
 */
module.exports = function() {

  var loadModule = function(moduleName) {
    var mod = require.resolve(moduleName);
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
      delete require.cache[moduleName];
    }
    return require(moduleName);
  };



  var checkPaths = function checkPaths(path, cb) {
    fs.exists(path, function(exists) {
      if (!exists) { return cb('path not found: ' + path); }
      fs.exists(path + '/definitions', function(exists) {
        if (!exists) { return cb('path not found: ' + path + '/definitions'); }
        fs.exists(path + '/system.js', function(exists) {
          if (!exists) { return cb('file not found: ' + path + '/system.json'); }
          cb();
        });
      });
    });
  };



  var validate = function(system) {
    var valid = true;

    _.each(system.containerDefinitions, function(cdef) {
      if (valid) {
        valid = _.isString(cdef.type);
      }
    });
    return valid;
  };



  var compileHeader = function compileHeader(system, sys) {
    system.name = sys.name;
    system.namespace = sys.namespace;
    system.id = sys.id;
  };



  var compileContainerDefs = function compileContainerDefs(system, sys, defs) {
    system.containerDefinitions= [];
    _.each(defs, function(def) {
      _.each(_.keys(def), function(key) {
        var obj = def[key];
        if (!obj.id) { obj.id =  key; }
        if (!obj.name) { obj.name = key; }
        system.containerDefinitions.push(obj);
      });
    });
  };



  var getParentContainer = function(path, isLeaf) {
    var result = {};
    
    if (path.length === 1) {
      result.name = path[0];
      result.path = path;
      result.selfRef = true;
    }
    else {
      for (var idx = path.length - 1; idx >= 0; --idx) {
        if (isNaN(path[idx])) {
          if (isLeaf) {
            result.path = path.slice(0, idx + 1);
            if (result.path[result.path.length - 1] === 'contains') {
              result.path = path.slice(0, result.path.length - 1);
            }
          }
          else {
            if (!isNaN(path[path.length - 2])) {
              result.path = path.slice(0, idx - 1);
            }
            else {
              result.path = path.slice(0, idx);
            }
          }
          result.name = result.path[result.path.length - 1];
          break;
        }
      }
    }
    return result;
  };



  var getType = function(system, containerDefinitionId) {
    var cdef = _.find(system.containerDefinitions, function(cdef) { return cdef.id === containerDefinitionId; });
    return cdef ? cdef.type : undefined;
  };



  var createTopologyNode = function(system, _this, containers, def) {
    var identifier = _this.isLeaf ? _this.node : _this.key;
    var containedBy = getParentContainer(_this.path, _this.isLeaf);
    var id = identifier + '-' + crc.crc32('' + _this.path).toString(16);
    var parentId = containedBy.name + '-' + crc.crc32('' + containedBy.path).toString(16);

    containers[id] = {id: id,
                      containedBy: parentId,
                      containerDefinitionId: identifier,
                      type: getType(system, identifier),
                      contains: [],
                      specific: def.specific ? _.cloneDeep(def.specific) : {}};

    _.each(_this.keys, function(key) {
      if (isNaN(key) && key !== 'contains') {
        if (key === 'specific') {
          _.merge(containers[id].specific, _this.node[key]);
        }
      }
    });

    if (containers[parentId] && !containedBy.selfRef) {
      containers[parentId].contains.push(id);
    }
  };



  var compileTopology = function compileTopology(platform, system, sys, defs) {
    system.topology = {containers: {}};
    var containers = system.topology.containers;
    var match;
    var key;

    if (sys.topology[platform] && _.keys(sys.topology[platform]).length > 0) {
      traverse(sys.topology[platform]).forEach(function() {
        var _this = this;
        if (_this.isLeaf) {
          _.each(defs, function(def) {
            match = _.find(_.keys(def), function(key) { return key === _this.node; });
            if (match) {
              createTopologyNode(system, _this, containers, def[match]);
            }
          });
        }
        else {
          _.each(defs, function(def) {
            if (_this.key) {
              key = _this.key.indexOf('$') !== -1 ? _this.key.split('$')[0] : _this.key;
              match = _.find(_.keys(def), function(mkey) { return mkey === key; });
              if (match) {
                createTopologyNode(system, _this, containers, def[match]);
              }
            }
          });
        }
      });
    }
  };



  /**
   * lint system definition file list
   */
  var lintFiles = function(index, list, cb) {
    if (index < list.length) {
      lint(list[index], function(err, result) {
        if (err) { return cb(err); }
        if (result.result === 'ok') {
          lintFiles(index + 1, list, cb);
        }
        else {
          cb(null, result);
        }
      });
    }
    else {
      cb(null, {result: 'ok'});
    }
  };



  /**
   * compile an abstract system definition from the source files on disk.
   * The source files are:
   *
   * - everything in the definitions folder
   * - system.js
   */
  // handle require fail
  var compile = function compile(path, platform, cb) {
    var defs = [];
    var sys;
    var system = {};

    checkPaths(path, function(err) {
      if (err) { return cb(err); }
      fs.readdir(path + '/definitions', function(err, files) {
        if (err) { return cb(err); }

        var lintList = [];
        _.each(files, function(file) {
          lintList.push(path + '/definitions/' + file);
        });
        lintList.push(path + '/system.js');
        lintFiles(0, lintList, function(err, result) {
          if (err) { return cb(err); }
          if (result.result !== 'ok') { return cb(result); }

          _.each(files, function(file) {
            defs.push(loadModule(path + '/definitions/' + file));
          });
          sys = loadModule(path + '/system.js');

          compileHeader(system, sys);
          compileContainerDefs(system, sys, defs);
          compileTopology(platform, system, sys, defs);
          cb(!validate(system), system);
        });
      });
    });
  };


  return {
    compile: compile
  };
};
 
