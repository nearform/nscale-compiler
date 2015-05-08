exports.web = {
  type: 'process',
  specific: {
    repositoryUrl: 'git@github.com:nearform/nscaledemoweb.git',
    execute: {
      args: '-p 8000:8000 -d',
      exec: '/usr/bin/node index.js'
    }
  }
};
