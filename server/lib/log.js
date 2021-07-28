import pino from 'pino';
import config from '@server/config';

const logConfig = {
  base: null,
  level: config.logLevel
};

if (config.NODE_ENV !== 'production') {
  // Note: pino-pretty is installed as a dev package
  logConfig.prettyPrint = {
    ignore: 'pid,hostname',
    colorize: true
  };
}

export default pino(logConfig);
