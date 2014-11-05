exports.types = {
  aws: {
    'container': 'blank-container',
    'process': 'docker',
    'load-balancer': 'aws-elb',
    'access-rules': 'aws-sg',
    'machine-image': 'aws-ami'
  },
  local: {
    'container': 'blank-container',
    'process': 'docker',
  },
  direct: {
    'container': 'blank-container',
    'process': 'docker',
  }
};

exports.ids = {
  aws: {},
  local: {},
  direct: {}
};

