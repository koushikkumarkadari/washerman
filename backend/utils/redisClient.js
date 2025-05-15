
// utils/redisClient.js
import { createClient } from 'redis';

const client = createClient({
  username: 'default',
  password: 'LdFyQZpoy19fvfXCWa3YxJU5fBlKtDoT',
  socket: {
    host: "redis-17542.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 17542
  }
});

client.on('error', err => console.error('❌ Redis Client Error', err));

await client.connect();

export default client;

