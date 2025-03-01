import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Quick response for Kubernetes probes
    return NextResponse.json(
      { 
        status: 'healthy',
        timestamp: new Date().toISOString()
      },
      { 
        status: 200,
        headers: {
          // Add cache control to prevent caching
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


// Container Health Checks:
// Kubernetes uses it to monitor if your Next.js container is alive and running
// The endpoint returns a simple 200 status when healthy
// Helps Kubernetes decide if it needs to restart your pod
// Load Balancer Checks:
// Services can check if your app is ready to receive traffic
// Helps with zero-downtime deployments
// Ensures traffic only goes to healthy instances
// Monitoring:
// Basic uptime monitoring
// Timestamp helps track when the service was last responsive
// Error states help with debugging