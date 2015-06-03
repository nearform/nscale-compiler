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


/**
 * environment handler
 * for each target container generate an environment block that is made available to the process
 * running inside the continaer
 */
module.exports = function() {
  var proxyCurrent;
  var serviceCurrent;
  var auto;


  var generateStdEnv = function generateStdEnv(system) {
    var env = {PROXY_HOST: '__TARGETIP__'};

    _.each(system.topology.containers, function(c) {
      if (c.specific && c.specific.proxyPort) {
        if (c.specific.proxyPort === 'auto') {
          if (auto[c.name]) {
            c.specific.proxyPort = auto[c.name];
          }
          else {
            c.specific.proxyPort = proxyCurrent;
            auto[c.name] = proxyCurrent;
            ++proxyCurrent;
          }
        }
        env[c.name + '_PORT'] = c.specific.proxyPort;
      }
    });
    return env;
  };



  var generateSpecficEnv = function generateSpecficEnv(env, container) {
    if (container.specific && container.specific.servicePort) {
      if (container.specific.servicePort === 'auto') {
        container.specific.servicePort = serviceCurrent;
        ++serviceCurrent;
      }
      env.SERVICE_HOST = '0.0.0.0';
      env.SERVICE_PORT = container.specific.servicePort;
    }
    return env;
  };



  var generate = function generate(path, system) {
    var cfg;
    proxyCurrent = 10000;
    serviceCurrent = 20000;
    auto = {};

    fs.exists(path + '/config.js', function (exists) {
      if (exists) {
        cfg = require(path + '/config.js');
        if (cfg.enableProxy) {
          var env = generateStdEnv(system);

          _.each(system.topology.containers, function(c) {
            if (c.specific) {
              c.specific.environment = generateSpecficEnv(_.cloneDeep(env), c);
            }
          });
        }
      }
    });
  };



  return {
    generate: generate
  };
};

