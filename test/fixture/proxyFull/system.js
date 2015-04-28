// Define the system topology here. The topolgy should reference 
// containers defined in definitions/services.js
exports.name = 'wibble';
exports.namespace = 'wibble';
exports.id = '33adb1b7-d6cd-474a-9ef7-db188f9ea4b4';

exports.topology = {
  local: {
    root: [
      'users',
      'permissions',
      'business-logic',
      'audit',
      'emails',
      'search',
      'frontend'
    ]
  },

  beta: {
    root: [

      // front end
      {machine: {
        contains: ['nginxfe', {frontend: { specific: { execute: {args: '-e MONITORING_INTERFACE=0.0.0.0 -e PORT=8000 -p 8000:8000 -p 8200:8002 --dns 172.17.42.1 -d'}}}},
                              {frontend: { specific: { execute: {args: '-e MONITORING_INTERFACE=0.0.0.0 -e PORT=8000 -p 8003:8000 -p 8203:8002 --dns 172.17.42.1 -d'}}}}],
        specific: { 
          ipAddress: '10.1.0.101',
          user: 'wibble',
          identityFile: '/home/cexadministrator/keys/nscale-key'
        }
      }},

      // services
      {machine: {
        contains: [{users: { specific: { servicePort: 11000, execute: { args: '-e PORT=10002 -p 11000:10002 --dns 172.17.42.1 -d'}}}},
                   {permissions: { specific: { servicePort: 12000, execute: { args: '-e POSTGRESQL=1 -e PORT=10005 -p 12000:10005 --dns 172.17.42.1 -d'}}}},
                   {'business-logic': { specific: { servicePort: 13000, execute: { args: '-e POSTGRESQL=1 -e PORT=10001 -p 13000:10001 --dns 172.17.42.1 -d'}}}},
                   {audit: { specific:  { servicePort: 1400, execute: { args: '-e POSTGRESQL=1 -e PORT=10003 -p 14000:10003 --dns 172.17.42.1 -d'}}}},
                   {audit: { specific:  { servicePort: 1401, execute: { args: '-e POSTGRESQL=1 -e PORT=10003 -p 14000:10003 --dns 172.17.42.1 -d'}}}},
                   {emails: { specific: { servicePort: 1500, execute: { args: '-e POSTGRESQL=1 -e PORT=10003 -p 16000:10003 --dns 172.17.42.1 -d'}}}},
                   {search: { specific: { servicePort: 1600, execute: { args: '-e PORT=10004 -p 15001:10004 --dns 172.17.42.1 -d'}}}}],
        specific: { 
          ipAddress: '10.1.0.103',
          user: 'wibble',
          identityFile: '/home/root/keys/nscale-key'
        }
      }},

      // infrastructure
      {machine: {
        contains: ['redis', 'elasticsearch'],
        specific: { 
          ipAddress: '10.1.0.105',
          user: 'wibble',
          identityFile: '/home/cexadministrator/keys/nscale-key'
        }
      }},
    ]
  }
};

