import development from './config.dev';
import production from './config.prod';

const env = process.env.NODE_ENV || 'development';

const configurations = {
  development,
  production,
};
const config = configurations[env];
export default () => config;
