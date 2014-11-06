exports.types = {
  aws: {
    'container': 'blank-container',
    'process': 'docker',
    'load-balancer': 'aws-elb',
    'access-rules': 'aws-sg',
    'machine-image': 'aws-ami',
    'registry': 'docker-registry'
  },
  local: {
    'container': 'blank-container',
    'process': 'docker',
    'registry': 'docker-registry'
  },
  direct: {
    'container': 'blank-container',
    'process': 'docker',
    'registry': 'docker-registry'
  }
};

exports.ids = {
  aws: {},
  local: {},
  direct: {}
};

