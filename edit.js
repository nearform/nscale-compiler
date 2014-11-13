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



module.exports = function() {


  var writeSystem = function(path, module, cb) {
    var serialize = '';

    _.each(_.keys(module), function(key) {
      serialize += 'exports.' + key + '=' + JSON.stringify(module[key], null, 2) + ';\n';
    });
    serialize = serialize.replace(/\"/g, '\'');
    cb(fs.writeFileSync(path + '/system.js', serialize, 'utf8'));
  };



  var loadModule = function(moduleName) {
    var mod = require.resolve(moduleName);
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
      delete require.cache[moduleName];
    }
    return require(moduleName);
  };



  var addContainer = function(path, container, cb) {
    var c = JSON.parse(container);
    if (!fs.existsSync(path + '/definitions/' + c.name)) {
      container = container.replace(/"/g, '\'');
      container = container + ';';
      var serialized = 'exports.' + c.name + '=' + container;
      fs.writeFileSync(path + '/definitions/' + c.name + '.js', serialized, 'utf8');
      cb();
    }
    else {
      cb('error: container already exists');
    }
  };



  var linkContainer = function(path, data, cb) {
    try {
      var s = data.split(':');
      var linkPath = s[0];
      var containerName = s[1];
      var module = loadModule(path + '/system.js');
      var target = module.topology;

      _.each(linkPath.split('/'), function(element) {
        target = target[element];
      });
      target.push(containerName);

      writeSystem(path, module, function(err) {
        cb(err);
      });
    }
    catch (e) {
      cb('' + e);
    }
  };



  var removeContainer = function(path, containerName, cb) {
    var sys = loadModule(path + '/system.js');
    var save = false;

    if (fs.existsSync(path + '/definitions/' + containerName + '.js')) {
      fs.unlinkSync(path + '/definitions/' + containerName + '.js');
    }

    traverse(sys.topology).forEach(function() {
      if (this.key === containerName) {
        this.remove();
        save = true;
      }
      if (this.node === containerName) {
        this.remove();
        save = true;
      }
    });

    if (save) {
      writeSystem(path, sys, function(err) {
        cb(err);
      });
    }
    else {
      cb();
    }
  };



  var commands = {addContainer: addContainer,
                  linkContainer: linkContainer,
                  removeContainer: removeContainer};




  var edit = function(path, command, data, cb) {
    commands[command](path, data, cb);
  };



  return {
    edit: edit
  };
};
 
