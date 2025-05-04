import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Get token from request headers or cookies
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 401 });
    }
    
    // Verify token and extract user ID
    const payload = await verifyToken(token);
    
    if (!payload || typeof payload === 'string' || !('userId' in payload)) {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
    }
    
    // If it's an admin token with special ID, it's valid
    if (payload.userId === 'admin-id') {
      return NextResponse.json({ valid: true, isAdmin: true });
    }
    
    // For regular users, check if user exists in database
    await connectDB();
    
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ valid: false, error: 'User not found' }, { status: 404 });
    }
    
    // If we get here, token is valid
    return NextResponse.json({ 
      valid: true,
      isAdmin: user.isAdmin || false
    });
    
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 });
  }
}