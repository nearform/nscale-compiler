// Define the system topology here. The topolgy should reference 
// containers defined in definitions/services.js

exports.name = 'isnc';
exports.namespace = 'isnc';
exports.id = '12121212-bf98-4d29-b1c8-d1885bc5c294';

exports.topology = {
  local: {
    root: [
      'postgres',
      'redis',
      'elasticsearch',
      'consul-onemachine',
      'users',
      'permissions',
      'business-logic',
      'audit',
      'emails',
      'frontend'
    ]
  },

  direct: {
    root: [
      {machine: {contains: ['frontend', 'consul-onemachine'], specific: { ipAddress: '1.2.3.4'}}},
      {machine: {contains: ['users', 'permissions', 'business-logic', 'audit', 'emails', 'consul-onemachine'], specific: { ipAddress: '1.2.3.4'}}},
    ]
  }
};

