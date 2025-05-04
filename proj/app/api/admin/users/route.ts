import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Type for a lean user object returned from MongoDB
type LeanUser = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  isAdmin?: boolean;
  createdAt: Date;
  orders: any[];
};

// Get all users
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload === 'string' || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();

    const users = (await User.find({})
      .select('name email phone isAdmin createdAt orders')
      .lean())
      .map(user => ({
        ...user,
        _id: new mongoose.Types.ObjectId(user._id.toString())
      })) as LeanUser[];

    return NextResponse.json({
      users: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt,
        orders: user.orders || []
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload === 'string' || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, email, password, phone, isAdmin } = await request.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      isAdmin: isAdmin || false,
      orders: []
    }) as unknown as LeanUser & { _id: mongoose.Types.ObjectId };

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        orders: user.orders || []
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
