import { NextResponse } from "next/server";

/**
 * Simplified notification API route
 * This version doesn't rely on external dependencies that might cause build errors
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Log the notification request (for debugging)
    console.log('Notification request received:', body);
    
    // In a production environment, you would send the notification here
    // For now, we'll just return a success response
    
    return NextResponse.json({ 
      success: true,
      message: 'Notification request received'
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing notification:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
