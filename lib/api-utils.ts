/**
 * Utility functions for API requests
 */

/**
 * Get the base URL for API requests
 * This will return the correct base URL for both development and production environments
 */
export function getBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In browser, use the current origin
    return window.location.origin;
  }
  
  // In server-side rendering or API routes
  // Use environment variable if available
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Fallback to localhost in development
  return process.env.NODE_ENV === 'production'
    ? 'https://vibe-coding-base-summit.vercel.app' // Production domain
    : 'http://localhost:3000';
}

/**
 * Get the full URL for an API endpoint
 * @param path - The API path (e.g., '/api/poll')
 */
export function getApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
