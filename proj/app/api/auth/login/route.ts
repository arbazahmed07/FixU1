import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';


// Extend JwtPayload to include isAdmin
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId?: string;
    email?: string;
    isAdmin?: boolean;
  }
}

// Define a custom token payload type
interface TokenPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

// Define proper user type interface
interface UserDocument {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Special case for admin
    if (email === process.env.EMAIL && password === process.env.PASS) {
      // Generate proper JWT token for admin using the same method as regular users
      const adminPayload: TokenPayload = { 
        userId: 'admin-id', 
        email: process.env.EMAIL ||'admin@fixu.in',
        isAdmin: true 
      };
      
      const adminToken = generateToken(adminPayload);
      
      const response = NextResponse.json({
        token: adminToken,
        user: {
          id: 'admin-id',
          name: 'Administrator',
          email: process.env.EMAIL ||'admin@fixu.in',
          isAdmin: true
        }
      });
      
      // Set HTTP-only cookie with the token that will be sent with every request
      response.cookies.set({
        name: 'auth-token',
        value: adminToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      return response;
    }
    
    // Regular user authentication flow
    await connectDB();
    
    // Find the user - using properly defined interface
    const user = await User.findOne({ email }) as UserDocument | null;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }
    
    // Compare password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }
    
    // Generate token with properly typed payload
    const userPayload: TokenPayload = { 
      userId: user._id.toString(), 
      email: user.email,
      isAdmin: user.isAdmin || false
    };
    
    const token = generateToken(userPayload);
    
    const response = NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin || false
      }
    });
    
    // Set HTTP-only cookie with the token
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    );
  }
}