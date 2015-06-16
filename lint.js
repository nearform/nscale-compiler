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

var jshint = require('jshint').JSHINT;
var jshintcli = require('jshint/src/cli');
var fs = require('fs');
var _ = require('lodash');


module.exports = function lint() {

  var defaultConfig = jshintcli.loadConfig(__dirname + '/.jshintrc');
  
  var reportErrors = function(filePath) {
    var results;

    results = jshint.errors.map(function(err) {
      if (!err) { return; }
      return 'error: ' + err.reason + ', file: ' + filePath + ', line: ' + err.line;
    }).filter(Boolean);

    return results;
  };



  return function lint(filePath, systemPath, cb) {
    fs.readFile(filePath, 'utf8', function(err, str) {
      if (err) { return cb(err); }
      var localPath = systemPath + '/.jshintrc';
      
      fs.exists(localPath, function (exists) {
        var cfg;
        var result = {};
        var stat;

        if (exists) {
          cfg = jshintcli.loadConfig(localPath);
          result.localConfig = true;
        } 
        else {
          cfg = defaultConfig;
          result.localConfig = false;
        }
        delete cfg.dirname;
      
        stat = jshint(str, cfg, {});
        if (!stat) {
          result.result = 'err';
          result.err= reportErrors(filePath);
        }
        else {
          result.result = 'ok';
        }
        return cb(err, result);
      });

    });
  };
};

