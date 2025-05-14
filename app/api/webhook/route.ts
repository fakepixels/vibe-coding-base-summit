import { NextResponse } from "next/server";

/**
 * Simplified webhook API route
 * This version doesn't rely on external dependencies that might cause build errors
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Log the webhook request (for debugging)
    console.log('Webhook request received:', body);
    
    // In a production environment, you would process the webhook here
    // For now, we'll just return a success response
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook request received'
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
