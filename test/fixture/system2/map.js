exports.types = {
  aws: {},
  local: {}
};


exports.ids = {
  aws: {
    webElb: {nativeId: 'sudc-bal-1117399678.us-west-2.elb.amazonaws.com'},
    webSg: {nativeId: 'sg-5bdc573e'},
    ami: {nativeId: 'ami-cf0741ff'},
    web: {name: 'web'},
    histsrv: {name: 'hist-srv'},
    docsrv: {name: 'doc-srv'},
    realsrv: {name: 'real-srv'}
  },
  local: {
    root: { id: '85d99b2c-06d0-5485-9501-4d4ed429799c' },
    web: {name: 'web'},
    histsrv: {name: 'hist-srv'},
    docsrv: {name: 'doc-srv'},
    realsrv: {name: 'real-srv'}
  }
};

