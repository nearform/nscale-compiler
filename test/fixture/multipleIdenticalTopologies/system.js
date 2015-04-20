exports.name='sudc';
exports.namespace='sudc';
exports.id='e7bb3963-fd16-4b1b-ae9f-5fa16e2d192d';

var topology = {
  'webElb': [
    {
      'webSg': [
        {
          'machine': [
            'web'
          ]
        },
        {
          'machine': [
            'docsrv',
            'histsrv',
            'realsrv'
          ]
        }
      ]
    }
  ],
  'machine': [
    'redis'
  ]
};

exports.topology={
  'aws': topology,
  'local': topology
};
