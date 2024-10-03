const { createClient } = require('redis');

const PORT = process.env.REDIS_PORT || 6379;
const HOST = process.env.REDIS_HOST || 'redis';

const client = createClient({
    url: `redis://${HOST}:${PORT}`,
    password: process.env.REDIS_PASSWORD
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (error) => {
    console.error(error);
});

module.exports = client;
