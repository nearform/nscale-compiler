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
var stdMap = require('./map/mappings');



module.exports = function() {

  var loadFile = function(path, file, cb) {
    fs.exists(path, function(exists) {
      if (!exists) { return cb('path not found: ' + path); }
      fs.exists(path + '/' + file, function(exists) {
        if (!exists) { return cb('path not found: ' + path + '/' + file); }
        cb(null, require(path + '/' + file));
      });
    });
  };



  var replaceTypes = function(sys, platform, mappings) {
    _.each(sys.containerDefinitions, function(cdef) {
      if (cdef.type && mappings.types[platform][cdef.type]) {
        cdef.type = mappings.types[platform][cdef.type];
      }
    });
    _.each(sys.topology.containers, function(c) {
      if (c.type && mappings.types[platform][c.type]) {
        c.type = mappings.types[platform][c.type];
      }
    });
  };



  var deleteUntyped = function(sys, platform, mappings) {
    var toDelete = [];
    var idx = 0;

    _.each(sys.containerDefinitions, function(cdef) {
      if (!(cdef.type && mappings.types[platform] && mappings.types[platform][cdef.type])) {
        toDelete.push(idx);
      }
      ++idx;
    });

    idx = 0;
    _.each(toDelete, function(deleteIdx) {
      sys.containerDefinitions.splice(deleteIdx - idx, 1);
      ++idx;
    });
  };



  var setIds = function(sys, platform, mappings) {
    _.each(sys.containerDefinitions, function(cdef) {
      if (cdef.id && mappings.ids[platform][cdef.id]) {
        if (mappings.ids[platform][cdef.id].nativeId) {
          cdef.nativeId = mappings.ids[platform][cdef.id].nativeId;
        }
        if (mappings.ids[platform][cdef.id].name) {
          cdef.name = mappings.ids[platform][cdef.id].name;
        }
        if (mappings.ids[platform][cdef.id].id) {
          _.each(sys.topology.containers, function(c) {
            if (c.containerDefinitionId === cdef.id) {
              c.containerDefinitionId = mappings.ids[platform][cdef.id].id;
            }
          });
          cdef.id = mappings.ids[platform][cdef.id].id;
        }
      }
    });
  };



  var map = function map(path, platform, abstractSystem, cb) {
    var mp = _.cloneDeep(stdMap);
    var system;

    loadFile(path, 'map.js', function(err, customMap) {
      customMap = customMap || {};
      if (customMap.types && customMap.types[platform]) {
        _.each(_.keys(customMap.types[platform]), function(key) {
          mp.types[platform][key] = customMap.types[platform][key];
        });
      }
      if (customMap.ids && customMap.ids[platform]) {
        _.each(_.keys(customMap.ids[platform]), function(key) {
          mp.ids[platform][key] = customMap.ids[platform][key];
        });
      }

      system = _.cloneDeep(abstractSystem);
      deleteUntyped(system, platform, mp);
      replaceTypes(system, platform, mp);
      setIds(system, platform, mp);
      cb(null, system);
    });
  };



  return {
    map: map
  };
};

