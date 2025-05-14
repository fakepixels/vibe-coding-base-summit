import { NextResponse } from "next/server";
import { hasVoted } from "@/lib/poll";

// GET /api/poll/user?address=0x... - Check if a user has voted
export async function GET(request: Request) {
  try {
    // Get address from query params
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { success: false, error: "Address parameter is required" },
        { status: 400 }
      );
    }

    // Check if the address has voted
    const voted = await hasVoted(address);

    return NextResponse.json({
      success: true,
      hasVoted: voted,
    });
  } catch (error) {
    console.error("Error checking if user has voted:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
