import { createClient  } from "redis";

const url = "redis://test-redis_stack-1:6379"
const redis = createClient({url:url})


try {
  await redis.connect();
  console.log("##########################################################");
  console.log("#####            REDIS STORE CONNECTED               #####");
  console.log("##########################################################\n");
} catch (err) {
  console.log(`Redis error: ${err}`.red.bold);
}
export default redis;
