import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Get all orders
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    
    // Fetch all users with their orders
    const users = await User.find({}).select('name email phone orders').lean();
    
    // Extract and format all orders
    const orders = users.flatMap(user => 
      (user.orders || []).map(order => ({
        id: order._id.toString(),
        serviceName: order.serviceName,
        // specificService: order.specificService, // Removed as it does not exist on the type
        serviceProvider: order.serviceProvider,
        status: order.status,
        scheduledDate: order.scheduledDate,
        price: order.price,
        address: order.address,
        customerName: order.customerName || user.name,
        customerPhone: order.customerPhone || user.phone,
        customerEmail: order.customerEmail || user.email,
        customerNotes: order.customerNotes,
        createdAt: order.createdAt,
        userId: user._id.toString(),
        userName: user.name
      }))
    );
    
    // Sort orders by created date, newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}