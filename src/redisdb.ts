import * as redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

// Connect to REDIS cloud
const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
};

const redisClient = redis.createClient(redisConfig);

redisClient.on('connect', function(error) {
    console.log('Redis connection established');
});
redisClient.on('error', function(error) {
    console.log('Error in Redis connection');
});

export default redisClient;