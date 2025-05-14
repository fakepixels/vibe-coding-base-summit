import { Redis } from "@upstash/redis";

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  console.warn(
    "REDIS_URL or REDIS_TOKEN environment variable is not defined, please add to enable background notifications and webhooks.",
  );
}

// Function to ensure the Redis URL is in the correct format
// Upstash Redis client requires https:// URLs, not rediss:// URLs
function getFormattedRedisUrl(url: string): string {
  // If the URL starts with rediss://, convert it to https://
  if (url.startsWith("rediss://")) {
    // Extract the host from the rediss:// URL
    const match = url.match(/rediss:\/\/(.+)@(.+):(\d+)/);
    if (match) {
      const [, , host] = match;
      return `https://${host}`;
    }
  }
  return url;
}

export const redis =
  process.env.REDIS_URL && process.env.REDIS_TOKEN
    ? new Redis({
        url: process.env.REDIS_URL.startsWith("rediss://") 
          ? getFormattedRedisUrl(process.env.REDIS_URL)
          : process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      })
    : null;
