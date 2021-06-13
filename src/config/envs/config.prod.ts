export default {
  app: {
    name: 'Prod',
    version: 1.0,
  },
  common: {
    pageSize: 10,
    maxPageSize: 100,
  },
  mongo: {
    url: `mongodb://localhost:27017/Dev`,
  },
  authentication: {
    key: 'Hello World this is the secret key of jwt',
  },
  port: 8080,
  NODE_ENV: 'production',

};
