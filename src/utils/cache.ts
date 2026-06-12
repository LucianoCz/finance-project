import NodeCache from 'node-cache';

// TTL padrão de 5 minutos
const cache = new NodeCache({ stdTTL: 300 });

export const getCache = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setCache = <T>(key: string, value: T, ttl?: number): boolean => {
  if (ttl) {
    return cache.set(key, value, ttl);
  }
  return cache.set(key, value);
};

export const invalidateCachePrefix = (prefix: string): void => {
  const keys = cache.keys();
  const keysToDelete = keys.filter(key => key.startsWith(prefix));
  cache.del(keysToDelete);
};

export const delCache = (key: string): number => {
  return cache.del(key);
};
