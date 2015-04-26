// Place service container definitions here.

exports.users = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    proxyPort: 10002,
    buildScript: 'buildusers.sh',
    processBuild: 'npm install; cd wibble; npm install',
    repositoryUrl: 'git@github.com:i-Sight/v5_nginx_services.git',
    execute: {
      exec: 'node /wibble/srv/users.js',
      cwd: 'srv',
      process: 'node users.js'
    }
  }
};

exports.permissions = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    proxyPort: 10005,
    processBuild: 'npm install; cd wibble; npm install',
    buildScript: 'buildperms.sh',
    repositoryUrl: 'git@github.com:i-Sight/v5_nginx_services.git',
    execute: {
      exec: 'node /wibble/srv/permissions.js',
      cwd: 'srv',
      process: 'node permissions.js'
    }
  }
};

exports['business-logic'] = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    proxyPort: 10001,
    processBuild: 'npm install; cd wibble; npm install',
    buildScript: 'buildbl.sh',
    repositoryUrl: 'git@github.com:i-Sight/v5_nginx_services.git',
    execute: {
      exec: 'node /wibble/srv/business-logic.js',
      cwd: 'srv',
      process: 'node business-logic.js'
    }
  }
};

exports.audit = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    proxyPort: 10003,
    processBuild: 'npm install; cd wibble; npm install',
    buildScript: 'buildaudit.sh',
    repositoryUrl: 'git@github.com:i-Sight/v5_nginx_services.git',
    execute: {
      exec: 'node /wibble/srv/audit.js',
      cwd: 'srv',
      process: 'node audit.js'
    }
  }
};

exports.emails = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    proxyPort: 10006,
    processBuild: 'npm install; cd wibble; npm install',
    buildScript: 'buildemail.sh',
    repositoryUrl: 'git@github.com:i-Sight/v5_nginx_services.git',
    execute: {
      exec: 'node /wibble/srv/emails.js',
      cwd: 'srv',
      process: 'node emails.js'
    }
  }
};

exports.search = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    proxyPort: 10004,
    processBuild: 'npm install; cd wibble; npm install',
    buildScript: 'buildsearch.sh',
    repositoryUrl: 'git@github.com:i-Sight/v5_nginx_services.git',
    execute: {
      exec: 'node /wibble/srv/search.js',
      cwd: 'srv',
      process: 'node search.js'
    }
  }
};

exports.frontend = {
  type: 'docker',
  override: {
    local: {
      type: 'process'
    }
  },
  specific: {
    buildScript: 'buildfe.sh',
    processBuild: 'npm install; cd wibble; npm install; bower install',
    repositoryUrl: 'git@github.com:i-Sight/v5_nginx_services.git',
    execute: {
      exec: '/bin/bash -c \'cd /wibble/wibble; node index.js\'',
      process: 'node srv/front.js'
    }
  }
};

