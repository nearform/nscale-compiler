exports.docsrv = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git',
    buildScript: 'builddoc.sh',
    container: {
      args: '-p 9002:9002',
      exec: '/usr/bin/node /srv/doc-srv'
    }
  }
};

exports.histsrv = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git',
    buildScript: 'buildhist.sh',
    container: {
      args: '-p 9000:9000',
      exec: '/usr/bin/node /srv/hist-srv'
    }
  }
};

exports.realsrv = {
  local: {
    type: 'process',
  },
  shared$: {
    type: 'docker',
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git#test',
    buildScript: 'buildreal.sh',
    container: {
      args: '-p 9001:9001',
      exec: '/usr/bin/node /srv/real-srv'
    }
  }
};


exports.web = {
  local: {
    type: 'process'
  },
  shared$: {
    type: 'docker',
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git#develop',
    buildScript: 'buildweb.sh',
    container: {
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

