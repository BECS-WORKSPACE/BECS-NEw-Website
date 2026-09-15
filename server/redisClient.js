const { createClient } = require('redis');

let redisClient = null;
let redisFailed = false;

async function getClient() {
  if (redisFailed) return null; // Don't try again if it failed
  
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    });
    
    redisClient.on('error', (err) => {
      console.log('Redis Client Error', err);
      redisFailed = true;
    });
    
    try {
      await redisClient.connect();
      console.log('Redis Client Connected');
    } catch (err) {
      console.error('Failed to connect to Redis. Running without cache.');
      redisFailed = true;
      return null;
    }
  }
  return redisClient;
}

module.exports = getClient;
