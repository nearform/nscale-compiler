exports.docsrv = {
  type: 'docker',
  specific: {
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git',
    buildScript: 'builddoc.sh',
    execute: {
      args: '-p 9002:9002',
      exec: '/usr/bin/node /srv/doc-srv'
    }
  }
};

exports.histsrv = {
  type: 'docker',
  specific: {
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git',
    buildScript: 'buildhist.sh',
    execute: {
      args: '-p 9000:9000',
      exec: '/usr/bin/node /srv/hist-srv'
    }
  }
};

exports.realsrv = {
  type: 'docker',
  specific: {
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git',
    buildScript: 'buildreal.sh',
    execute: {
      args: '-p 9001:9001',
      exec: '/usr/bin/node /srv/real-srv'
    }
  }
};

exports.web = {
  type: 'docker',
  specific: {
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git',
    buildScript: 'buildweb.sh',
    execute: {
      args: '-e WEB_HOST=10.75.29.243 -p 8000:8000',
      exec: 'sh /web/run.sh'
    }
  }
};

exports.redis = {
  type: 'docker',
  specific: {
    args: '-d --appendonly -p 6379:6379',
    name: 'redis'
  }
};

