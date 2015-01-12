exports.root = {
  type: 'container'
};

exports.webElb = {
  type: 'aws-elb',
  specific: {
    protocol: 'HTTP',
    loadBalancerPort: 80,
    instanceProtocol: 'HTTP',
    instancePort: 8000
  }
};

exports.webSg = {
  type: 'aws-sg',
  specific: {
    ingress: [{ipProtocol: 'tcp',
               fromPort: 22,
               toPort: 22,
               ipRanges: [{cidrIp: '0.0.0.0/0'}]},
              {ipProtocol: 'tcp',
               fromPort: 3000,
               toPort: 3000,
               ipRanges: [{cidrIp: '0.0.0.0/0'}]}],
    egress: []
  }
};

exports.machine = {
  type: 'aws-ami',

};

