// Description: Cache service wrapper for Nestjs CacheManager Module
import { Inject, Injectable } from '@nestjs/common';
import { RedisStore } from 'cache-manager-ioredis-yet';
import { Cache } from 'cache-manager';
import { Redis, RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  public client: Redis; // Redis client
  _config: RedisOptions;
  _log: boolean;

  constructor(
    @Inject(CACHE_MANAGER) public cacheManager: Cache<RedisStore>,
    private config: ConfigService,
  ) {
    this.client = this.cacheManager.store.client as Redis; // Assign the client from store to the client property
    this._config = this.config.get('cacheManager');
    this._log = Boolean(+process.env.REDIS_LOG);
  }

  /**
   * This function deletes all keys matching the pattern
   */
  async deleteKeysByPattern(pattern: string) {
    if (!pattern) return;
    const keyPrefix = this._config.keyPrefix || '';

    for await (const keys of this.scan(`${keyPrefix}${pattern}`)) {
      this._log &&
        console.log(`Deleting keys for ${keyPrefix}${pattern} :=`, keys);
      for (let key of keys) {
        if (key.startsWith(keyPrefix)) key = key.slice(keyPrefix.length);
        await this.cacheManager.del(key);
      }
    }
  }

  /**
   * This Functions is a generator function that returns a batch of keys matching the pattern
   * Count is no. of keys to redis will scan at a time
   *
   */
  async *scan(match: string, count = 500) {
    if (!match || count === 0) return [];
    let [cursor, batch] = await this.client.scan(
      0,
      'MATCH',
      match,
      'COUNT',
      count,
    );
    if (batch.length) yield batch;
    while (`${cursor}` !== '0') {
      // check if the cursor is at the end of iteration, it resets to 0 if there are no more keys to scan
      [cursor, batch] = await this.client.scan(
        cursor,
        'MATCH',
        match,
        'COUNT',
        count,
      );
      if (batch.length) yield batch;
    }
  }

  // Cache Manager functions Wrapper only so no need to document them
  get<T>(key: string) {
    return this.cacheManager.get<T>(key);
  }

  set(key: string, value: any, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }
}
