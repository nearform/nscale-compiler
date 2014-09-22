exports.services = {
  type: 'container'
};

exports.docsrv = {
  type: 'process',
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
  type: 'process',
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
  type: 'process',
  specific: {
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git',
    buildScript: 'buildreal.sh',
    container: {
      args: '-p 9001:9001',
      exec: '/usr/bin/node /srv/real-srv'
    }
  }
};

exports.web = {
  type: 'process',
  specific: {
    repositoryUrl: 'git@github.com:pelger/startupdeathclock.git',
    buildScript: 'buildweb.sh',
    container: {
      args: '-e WEB_HOST=10.75.29.243 -p 8000:8000',
      exec: 'sh /web/run.sh'
    }
  }
};

