import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Define an interface for the token payload
interface TokenPayload {
  userId: string;
  email: string;
  isAdmin?: boolean;
  [key: string]: any; // For any additional fields in the payload
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify the token with proper typing
    const payload = await verifyToken(authToken) as TokenPayload;
    
    // Return user data
    return NextResponse.json({
      token: authToken,
      user: {
        id: payload.userId,
        email: payload.email,
        isAdmin: payload.isAdmin || false,
        // You might want to fetch additional user data from DB here
        name: payload.isAdmin ? 'Administrator' : 'User'
      }
    });
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}