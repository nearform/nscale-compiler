exports.name='sudc';
exports.namespace='sudc';
exports.id='e7bb3963-fd16-4b1b-ae9f-5fa16e2d192d';
exports.topology={
  production: {
    webElb: {webSg: [{machine: ['web']},
                     {machine: ['realsrv']},
                     {machine: ['redis']}]}
  },
  staging: [{machine: ['web']},
            {machine: ['realsrv', 'redis']}],
  local: {root: ['web', 'realsrv', 'redis']}
};


