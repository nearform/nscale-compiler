exports.postgres = {
  type: 'docker',
  specific: {
    name: 'postgres:9.4',
    execute: {
      args: '-d -p 5432:5432 -v /mnt/postgres:/var/lib/postgresql/data'
    }
  }
};

exports.redis = {
  type: 'docker',
  specific: {
    name: 'redis:2.8',
    execute: {
      args: '-d -p 6379:6379'
    }
  }
};

exports.elasticsearch = {
  type: 'docker',
  specific: {
    name: 'dockerfile/elasticsearch',
    execute: {
      args: '-d -p 9200:9200 -p 9300:9300 -v /mnt/elasticsearch:/data',
      exec: '/elasticsearch/bin/elasticsearch --network.bind_host=0.0.0.0 --network.publish_host=__TARGETIP__'
    }
  }
};

