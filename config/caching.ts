import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export default registerAs('cacheManager', () => {
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: +process.env.REDIS_PORT || 6379,
    keyPrefix: process.env.REDIS_PREFIX || 'cache:',
    db: +process.env.REDIS_DB || 0,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  } as RedisOptions;
});
