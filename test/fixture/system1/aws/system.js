exports.name = 'sudc';
exports.namespace = 'sudc';
exports.id = 'e7bb3963-fd16-4b1b-ae9f-5fa16e2d192d';

exports.topology = {
  webElb: [
    {webSg: [{ami: ['web']},
             {ami: ['web']}]}
  ],
  services: [{ami: ['docsrv', 'histsrv', 'realsrv']},
             {ami: ['docsrv', 'histsrv', 'realsrv']}]
};

