import { redis } from "./redis";

// Key for storing poll data in Redis
const POLL_KEY = "poll:votes";

// Interface for a vote
export interface Vote {
  address: string;
  option: number;
  timestamp: number;
}

// Get all votes from Redis
export async function getAllVotes(): Promise<Vote[]> {
  if (!redis) {
    console.warn("Redis is not configured. Using empty votes array.");
    return [];
  }

  try {
    const votes = await redis.get<Vote[]>(POLL_KEY);
    return votes || [];
  } catch (error) {
    console.error("Error fetching votes from Redis:", error);
    return [];
  }
}

// Add a new vote to Redis
export async function addVote(vote: Vote): Promise<boolean> {
  if (!redis) {
    console.warn("Redis is not configured. Vote not saved.");
    return false;
  }

  try {
    // Get existing votes
    const votes = await getAllVotes();
    
    // Check if this address has already voted
    const existingVoteIndex = votes.findIndex(v => v.address === vote.address);
    
    if (existingVoteIndex !== -1) {
      // Update existing vote
      votes[existingVoteIndex] = vote;
    } else {
      // Add new vote
      votes.push(vote);
    }
    
    // Save back to Redis
    await redis.set(POLL_KEY, votes);
    return true;
  } catch (error) {
    console.error("Error saving vote to Redis:", error);
    return false;
  }
}

// Check if an address has already voted
export async function hasVoted(address: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    const votes = await getAllVotes();
    return votes.some(vote => vote.address === address);
  } catch (error) {
    console.error("Error checking if address has voted:", error);
    return false;
  }
}

// Get vote counts for each option
export async function getVoteCounts(): Promise<number[]> {
  try {
    const votes = await getAllVotes();
    const counts = [0, 0, 0, 0, 0]; // Initialize counts for 5 options
    
    for (const vote of votes) {
      if (vote.option >= 1 && vote.option <= 5) {
        counts[vote.option - 1]++;
      }
    }
    
    return counts;
  } catch (error) {
    console.error("Error calculating vote counts:", error);
    return [0, 0, 0, 0, 0];
  }
}

// Get the total number of votes
export async function getTotalVotes(): Promise<number> {
  try {
    const votes = await getAllVotes();
    return votes.length;
  } catch (error) {
    console.error("Error getting total votes:", error);
    return 0;
  }
}
