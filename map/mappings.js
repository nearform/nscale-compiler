exports.types = {
  aws: {
    'container': 'blank-container',
    'process': 'docker',
    'load-balancer': 'aws-elb',
    'access-rules': 'aws-sg',
    'machine-image': 'aws-ami',
    'docker': 'docker'
  },
  local: {
    'container': 'blank-container',
    'process': 'docker',
    'docker': 'docker'
  },
  direct: {
    'container': 'blank-container',
    'process': 'docker',
    'docker': 'docker'
  },
  process: {
    'container': 'blank-container',
    'process': 'process',
    'docker': 'docker'
  }
};

exports.ids = {
  aws: {},
  local: {},
  direct: {},
  process: {}
};

