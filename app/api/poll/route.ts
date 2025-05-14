import { NextResponse } from "next/server";
import { addVote, getVoteCounts, getTotalVotes } from "@/lib/poll";
import type { Vote } from "@/lib/poll";

// GET /api/poll - Get poll data
export async function GET() {
  try {
    // Get vote counts and total votes
    const [voteCounts, totalVotes] = await Promise.all([
      getVoteCounts(),
      getTotalVotes(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        voteCounts,
        totalVotes,
      },
    });
  } catch (error) {
    console.error("Error fetching poll data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/poll - Submit a vote
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, option } = body;

    // Validate input
    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid wallet address is required" },
        { status: 400 }
      );
    }

    if (!option || typeof option !== "number" || option < 1 || option > 5) {
      return NextResponse.json(
        { success: false, error: "Valid option (1-5) is required" },
        { status: 400 }
      );
    }

    // Create vote object
    const vote: Vote = {
      address,
      option,
      timestamp: Date.now(),
    };

    // Save vote
    const success = await addVote(vote);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to save vote" },
        { status: 500 }
      );
    }

    // Get updated vote counts
    const [voteCounts, totalVotes] = await Promise.all([
      getVoteCounts(),
      getTotalVotes(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        voteCounts,
        totalVotes,
      },
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
