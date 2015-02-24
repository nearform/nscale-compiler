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
var glob = require('glob');
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



  var compileContainerDefs = function compileContainerDefs(system, sys, defs, platform) {
    system.containerDefinitions= [];
    _.each(defs, function(def) {
      _.each(_.keys(def), function(key) {
        var obj = def[key];
        if (!obj.id) { obj.id =  key; }
        if (!obj.name) { obj.name = key; }
        if (obj.override && obj.override[platform]) {
          _.merge(obj, obj.override[platform]);
        }
        delete obj.override;
        system.containerDefinitions.push(obj);
      });
    });
  };



  var getParentContainer = function(path, isLeaf) {
    var result = {};
    var skipped = false;
    var removedCount = 0;

    if (isLeaf) {
      skipped = true;
    }

    if (path.length === 1) {
      result.name = path[0];
      result.path = path;
      result.selfRef = true;
    }
    else {
      var newPath = _.cloneDeep(path);
      while (newPath.length > 0) {
        if (!isNaN(newPath[newPath.length - 1])) {
          newPath = newPath.slice(0, newPath.length - 1);
          ++removedCount;
          continue;
        }
        if (newPath[newPath.length - 1] === 'contains') {
          newPath = newPath.slice(0, newPath.length - 1);
          ++removedCount;
          continue;
        }
        if (removedCount === 0) {
          newPath = newPath.slice(0, newPath.length - 1);
          ++removedCount;
          continue;
        }
        else {
          break;
        }
      }
      result.name = newPath[newPath.length - 1];
      result.path = newPath;
    }
    return result;
  };



  var getType = function(system, containerDefinitionId) {
    var cdef = _.find(system.containerDefinitions, function(cdef) { return cdef.id === containerDefinitionId; });
    return cdef ? cdef.type : undefined;
  };



  var createTopologyNode = function(system, _this, key, containers, def) {
    var identifier = _this.isLeaf ? _this.node : _this.key;
    var containerDefId = _this.isLeaf ? _this.node : key;
    var containedBy = getParentContainer(_this.path, _this.isLeaf);
    var id = identifier + '-' + crc.crc32('' + _this.path).toString(16);
    var parentId = containedBy.name + '-' + crc.crc32('' + containedBy.path).toString(16);

    containers[id] = {id: id,
                      containedBy: parentId,
                      containerDefinitionId: containerDefId,
                      type: getType(system, containerDefId),
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
    var result = {result: 'ok', err: []};
    var isDefined = [];
    var notDefined = [];


    // first pass create topology nodes and build definition list
    if (sys.topology[platform] && _.keys(sys.topology[platform]).length > 0) {
      traverse(sys.topology[platform]).forEach(function() {
        var _this = this;

        // do not create containers for the specific key.
        if (_this.path.indexOf('specific') >= 0 ) {
          return;
        }

        if (_this.isLeaf) {
          _.each(defs, function(def) {
            match = _.find(_.keys(def), function(key) { return key === _this.node; });
            if (match) {
              isDefined.push({path: _this.path, elm: _this.node});
              createTopologyNode(system, _this, _this.key, containers, def[match]);
            }
          });
        }
        else {
          _.each(defs, function(def) {
            if (_this.key) {
              key = _this.key.indexOf('$') !== -1 ? _this.key.split('$')[0] : _this.key;
              match = _.find(_.keys(def), function(mkey) { return mkey === key; });
              if (match) {
                isDefined.push({path: _this.path, elm: _this.key});
                createTopologyNode(system, _this, key, containers, def[match]);
              }
            }
          });
        }
      });
    }

    // second pass check for undefined elements
    traverse(sys.topology[platform]).forEach(function() {
      var _this = this;
      if (_this.isLeaf) {
        if (!_.find(isDefined, function(def) { return _this.node === def.elm; })) {
          if (_this.node !== 'contains' && _this.path.indexOf('specific') === -1 && _this.path.length > 0 && isNaN(_this.key)) {
            notDefined.push({path: _this.path, elm: _this.node});
          }
        }
      }
      else {
        if (!_.find(isDefined, function(def) { return _this.key === def.elm; })) {
          if (_this.key !== 'contains' && _this.path.indexOf('specific') === -1 && _this.path.length > 0 && isNaN(_this.key)) {
            notDefined.push({path: _this.path, elm: _this.key});
          }
        }
      }
    });

    if (notDefined.length > 0) {
      result.result = 'err';
      _.each(notDefined, function(ndef) {
        result.err.push('undefined element: ' + ndef.elm + ' at path: ' + ndef.path);
      });
    }

    return result;
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
   * remove container definitions that are not referenced in the topology section
   */
  var deleteUnreferenced = function(sys) {
    var keepList = [];
    var deleteList = [];
    var idx = 0;

    _.each(sys.containerDefinitions, function(cdef) {
      _.each(sys.topology.containers, function(c) {
        if (c.containerDefinitionId === cdef.id) {
          keepList.push(cdef.id);
        }
      });
    });

    _.each(sys.containerDefinitions, function(cdef) {
      if (!_.find(keepList, function(keep) { return keep === cdef.id; })) {
        deleteList.push(idx);
      }
      ++idx;
    });

    idx = 0;
    _.each(deleteList, function(deleteIdx) {
      sys.containerDefinitions.splice(deleteIdx - idx, 1);
      ++idx;
    });
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
      glob(path + '/definitions/**/*.js', function(err, files) {
        if (err) { return cb(err); }

        var lintList = [].concat(files);
        lintList.push(path + '/system.js');
        lintFiles(0, lintList, function(err, result) {
          if (err) { return cb(err); }
          if (result.result !== 'ok') { return cb(result); }

          _.each(files, function(file) {
            defs.push(loadModule(file));
          });
          sys = loadModule(path + '/system.js');

          compileHeader(system, sys);
          compileContainerDefs(system, sys, defs, platform);
          var res = compileTopology(platform, system, sys, defs);
          deleteUnreferenced(system);
          if (res.result === 'ok') {
            cb(!validate(system), system);
          }
          else {
            cb(res);
          }
        });
      });
    });
  };



  var targetList = function(path, cb) {
    var sys;
    var lintList = [path + '/system.js'];

    lintFiles(0, lintList, function(err, result) {
      if (err) { return cb(err); }
      if (result.result !== 'ok') { return cb(result); }
      sys = loadModule(path + '/system.js');
      cb(null, _.keys(sys.topology));
    });
  };



  return {
    getParentContainer: getParentContainer,
    compile: compile,
    targetList: targetList
  };
};

