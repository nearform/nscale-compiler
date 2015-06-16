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



/**
 * proxy injector
 *
 * for each target determine if proxies are enabled. If this is the case inject proxy containers into 
 * each machine. A machine is defined as a container that holds child docker or process containers.
 * This is done pre-compilation to the objects in the topology tree. In addition a proxy definition is 
 * added to the list of container definitions
 */
module.exports = function() {

  /**
   * nscale proxy definition, this will execute a container that holds the 
   */
  var proxyCDef = {
    type: 'docker',
    specific: {
      repositoryUrl: 'https://github.com/nearform/nscale-proxy-container.git',
      configPath: '/etc/haproxy/haproxy.cfg',
      hup: 'killall haproxy',
      execute: {
        args: '--net=host -d',
      }
    }
  };



  var injectCDef = function injectCDef(defs) {
    defs.push({__proxy: proxyCDef});
  };



  var isExecutableContainer = function(name, defs) {
    var result = false;
    _.each(defs, function(defSet) {
      if (defSet[name] && defSet[name].type) {
        if (defSet[name] && defSet[name].type && (defSet[name].type === 'docker' || defSet[name].type === 'process')) {
          result = true;
        }
      }
      else {
        _.each(defSet[name], function(ds) {
          if (ds.type && (ds.type === 'docker' || ds.type === 'process')) {
            result = true;
          }
        });
      }
    });
    return result;
  };

  

  var saveInjectPathUnique = function(path, injectPaths) {
    if (!_.find(injectPaths, function(ip) { return ip === path; })) {
      injectPaths.push(path);
    }
  };



  var inject = function(topology, paths) {
    _.each(paths, function(path) {
      var context = topology;
      _.each(path, function(element) {
        context = context[element];
      });
      context.push('__proxy');
    });
  };



  var isNumeric = function(s) {
    return !isNaN(parseInt(s));
  };



  /**
   * inject the proxy container on each machine container. A machine container is
   * defined as a container that directly holds process or docker containers
   */
  var injectContainers = function injectContainers(sys, defs, platform) {
    var injectPaths = [];

    traverse(sys.topology[platform]).forEach(function() {
      var _this = this;
      var name = _this.isLeaf ? _this.node : _this.key;

      if (isExecutableContainer(name, defs)) {
        saveInjectPathUnique(isNumeric(_this.parent.key) ? _this.parent.parent.path : _this.parent.path, injectPaths);
      }
    });
    inject(sys.topology[platform], injectPaths);
  };



  /**
   * determine if proxy containers are required for this target and insert them
   */
  var injectProxies = function injectProxies(path, target, sys, defs, cb) {
    var cfg;

    fs.exists(path + '/config.js', function (exists) {
      if (exists) {
        cfg = require(path + '/config.js');
        if (cfg.enableProxy && _.find(cfg.enableProxy, function(p) { return p === target; })) {
          injectCDef(defs);
          injectContainers(sys, defs, target);
          cb(null, sys, defs);
        }
        else {
          cb(null, sys, defs);
        }
      }
      else {
        cb(null, sys, defs);
      }
    });
  };



  return {
    injectProxies: injectProxies
  };
};

