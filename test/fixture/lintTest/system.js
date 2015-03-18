exports.name='sudc';
exports.namespace='sudc';
exports.id='e7bb3963-fd16-4b1b-ae9f-5fa16e2d192d';
exports.topology={
  'aws': {
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
  },
  'local': {
    'root': [
      'web',
      'docsrv',
      'histsrv',
      'realsrv',
      'redis'
    ]
  }
};
