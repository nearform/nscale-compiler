exports.root = {
  type: 'container'
};

exports.doc = {
  type: 'process',
  specific: {
    repositoryUrl: 'git@github.com:nearform/sudc-doc.git',
    buildScript: 'build.sh',
    execute: {
      args: '-p 9002:9002 -d',
      exec: '/usr/bin/node /srv/doc-srv.js'
    }
  }
};


exports.hist = {
  type: 'process',
  specific: {
    repositoryUrl: 'git@github.com:nearform/sudc-history.git',
    buildScript: 'build.sh',
    execute: {
      args: '-p 9003:9003 -d',
      exec: '/usr/bin/node /srv/hist-srv.js'
    }
  }
};

exports.real = {
  type: 'process',
  specific: {
    repositoryUrl: 'git@github.com:nearform/sudc-realtime.git',
    buildScript: 'build.sh',
    execute: {
      args: '-p 9001:9001 -d',
      exec: '/usr/bin/node /srv/real-srv.js'
    }
  }
};

exports.web = {
  type: 'process',
  specific: {
    repositoryUrl: 'git@github.com:nearform/sudc-web.git',
    buildScript: 'build.sh',
    execute: {
      args: '-p 8000:8000 -d',
      exec: '/bin/bash /web/run.sh'
    }
  }
};

