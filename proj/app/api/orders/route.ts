import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Special case for admin user
    if (payload.userId === 'admin-id' || payload.isAdmin === true) {
      // For admin, return empty orders array or fetch all orders if you want
      return NextResponse.json({ 
        orders: [],  // Or fetch all orders from the database for admin view
        isAdmin: true
      });
    }

    // Regular user flow
    await connectDB();

    // Now we know it's a regular user with a valid MongoDB ObjectId
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ orders: user.orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Special case for admin user
    if (decoded.userId === 'admin-id' || decoded.isAdmin === true) {
      // Admin can't place orders, or handle differently if needed
      return NextResponse.json({ 
        error: 'Admin users cannot place orders' 
      }, { status: 403 });
    }

    const orderData = await request.json();
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.orders.push({
      ...orderData,
      createdAt: new Date()
    });

    await user.save();

    return NextResponse.json({ success: true, message: 'Order saved successfully' });

  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json({ error: 'Server error processing order' }, { status: 500 });
  }
}
