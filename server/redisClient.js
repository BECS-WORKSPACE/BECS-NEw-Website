const { createClient } = require('redis');

let redisClient = null;

async function getClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    });
    
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    redisClient.on('connect', () => console.log('Redis Client Connected'));
    
    await redisClient.connect();
  }
  return redisClient;
}

module.exports = getClient;
