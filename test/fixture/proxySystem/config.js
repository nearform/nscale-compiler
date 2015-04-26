module.exports = {
  region: 'us-west-2',
  identityFile: 'key.pem',
  accessKeyId: 'YOUR_KEY_HERE',
  secretAccessKey: 'YOUR_SECRET_HERE',
  user: 'ubuntu',
  defaultSubnetId: 'subnet-xxxxxxxx',
  defaultVpcId: 'vpc-xxxxxxxx',
  defaultImageId: 'ami-xxxxxxxx',
  defaultInstanceType: 't2.medium',
  enableProxy: ['aws']
};
