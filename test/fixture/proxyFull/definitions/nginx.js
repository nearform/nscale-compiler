// nginx container definitions

exports.nginxfe = {
  type: 'docker',
  specific: {
    repositoryUrl: 'git@github.com:nearform/nscale.git',
    execute: {
      args: '-e _TARGETIP_=__TARGETIP__ -p __TARGETIP__:3000:3000 -d',
      exec: '/bin/bash /run.sh'
    }
  }
};

exports.nginxsvc = {
  type: 'docker',
  specific: {
    repositoryUrl: 'git@github.com:nearform/nscale.git',
    execute: {
      args: '-e _TARGETIP_=__TARGETIP__ -p __TARGETIP__:10001:10001 -p __TARGETIP__:10002:10002 -p __TARGETIP__:10003:10003 -p __TARGETIP__:10004:10004 -p __TARGETIP__:10005:10005 -p __TARGETIP__:10006:10006 -d',
      exec: '/bin/bash /run.sh'
    }
  }
};
