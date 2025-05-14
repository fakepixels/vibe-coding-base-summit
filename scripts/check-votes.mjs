// Script to check votes in Redis database
import { Redis } from '@upstash/redis';

// Create Redis client using environment variables
const redis = new Redis({
  url: "https://working-weevil-12729.upstash.io",
  token: "ATG5AAIjcDEzNjk2ZjYwYmM2NTY0ODc3ODE5ZTA0ZjY4Yjg3MDAyNHAxMA"
});

// Key for storing poll data in Redis
const POLL_KEY = "poll:votes";

async function checkVotes() {
  try {
    console.log('Checking votes in Redis database...');
    
    // Get votes from Redis
    const votes = await redis.get(POLL_KEY);
    
    if (!votes || votes.length === 0) {
      console.log('No votes found in the database.');
      return;
    }
    
    console.log(`Found ${votes.length} votes in the database:`);
    console.log(JSON.stringify(votes, null, 2));
    
    // Calculate vote counts
    const counts = [0, 0, 0, 0, 0];
    for (const vote of votes) {
      if (vote.option >= 1 && vote.option <= 5) {
        counts[vote.option - 1]++;
      }
    }
    
    console.log('\nVote counts:');
    counts.forEach((count, index) => {
      console.log(`Option ${index + 1}: ${count} votes`);
    });
    
  } catch (error) {
    console.error('Error checking votes:', error);
  }
}

// Run the function
checkVotes();
