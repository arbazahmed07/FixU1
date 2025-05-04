import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Service from '@/models/Service';

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
    
    // Count users
    const totalUsers = await User.countDocuments();
    
    // Count services and active services
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ active: true });
    
    // Count total orders
    const usersWithOrders = await User.find({}, 'orders');
    const totalOrders = usersWithOrders.reduce((total, user) => total + user.orders.length, 0);
    
    // Get recent activities (latest orders and registrations)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    
    const usersWithRecentOrders = await User.find({ 'orders.0': { $exists: true } })
      .sort({ 'orders.createdAt': -1 })
      .limit(5);
    
    // Format activities
    const recentActivities = [
      ...recentUsers.map(user => ({
        type: 'registration',
        message: `New user registered: ${user.name}`,
        timestamp: user.createdAt,
        userId: user._id
      })),
      ...usersWithRecentOrders.flatMap(user => {
        if (!user.orders || !user.orders.length) return [];
        
        // Get the most recent order
        const recentOrder = user.orders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        return {
          type: 'order',
          message: `New order: ${recentOrder.serviceName} by ${user.name}`,
          timestamp: recentOrder.createdAt,
          userId: user._id,
          orderId: recentOrder._id
        };
      })
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);  // Take only the 10 most recent activities
    
    return NextResponse.json({
      totalUsers,
      totalServices,
      activeServices,
      totalOrders,
      recentActivities
    });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}