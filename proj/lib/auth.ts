import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define JwtPayload interface
export interface JwtPayload {
  userId: string;
  email: string;
  isAdmin?: boolean;
}

// Function to generate a JWT token
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Function to verify a JWT token using jose
export async function verifyToken(token: string) {
  try {
    // Create a TextEncoder
    const encoder = new TextEncoder();
    
    // Get the JWT_SECRET from environment
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    
    // Convert your JWT_SECRET to Uint8Array
    const secretKey = encoder.encode(jwtSecret);
    
    try {
      // Try verifying with jose first
      const { payload } = await jose.jwtVerify(token, secretKey);
      return payload;
    } catch (joseError) {
      console.log("Jose verification failed, falling back to jwt:", joseError);
      
      // Fallback to traditional jwt verification
      try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded;
      } catch (jwtError) {
        console.error("JWT verification also failed:", jwtError);
        return null;
      }
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Function to get the token from request (Authorization header or cookies)
export function getTokenFromRequest(request: NextRequest): string | null {
  // First try to get token from Authorization header
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // Then try to get token from cookies
  const token = request.cookies.get('auth-token')?.value;
  if (token) {
    return token;
  }
  
  return null;
}

/**
 * Checks if the auth token exists in local storage
 */
export function hasStoredToken(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth-token');
  return !!token;
}

/**
 * Loads authentication data from local storage
 */
export function loadAuthFromStorage() {
  if (typeof window === 'undefined') return { token: null, user: null };
  
  try {
    const token = localStorage.getItem('auth-token');
    const userString = localStorage.getItem('auth-user');
    
    if (!token || !userString) return { token: null, user: null };
    
    const user = JSON.parse(userString);
    return { token, user };
  } catch (error) {
    console.error('Error loading auth from storage:', error);
    return { token: null, user: null };
  }
}

/**
 * Saves authentication data to local storage
 */
export function saveAuthToStorage(token: string, user: any) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', JSON.stringify(user));
    // Set session storage key to indicate this session has been authenticated
    sessionStorage.setItem('auth-session-active', 'true');
  } catch (error) {
    console.error('Error saving auth to storage:', error);
  }
}

/**
 * Clears authentication data from storage
 */
export function clearAuthFromStorage() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    sessionStorage.removeItem('auth-session-active');
    // Clear the auth cookie as well
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (error) {
    console.error('Error clearing auth from storage:', error);
  }
}
