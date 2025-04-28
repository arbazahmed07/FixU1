import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';


// Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const orderData = await request.json();
    await connectDB();

    // Find the user with this order
    const user = await User.findOne({ 'orders._id': params.id });
    if (!user) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Find and update the order
    const orderIndex = (user.orders as Array<{ _id: string; status?: string; scheduledDate?: Date; serviceProvider?: string; price?: number }>).findIndex(
      (order) => order._id.toString() === params.id
    );
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Update the order fields
    if (orderData.status) user.orders[orderIndex].status = orderData.status;
    if (orderData.scheduledDate) user.orders[orderIndex].scheduledDate = new Date(orderData.scheduledDate);
    if (orderData.serviceProvider) user.orders[orderIndex].serviceProvider = orderData.serviceProvider;
    if (orderData.price) user.orders[orderIndex].price = orderData.price;
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        id: (user.orders as Array<{ _id: string }>)[orderIndex]._id.toString(),
        status: user.orders[orderIndex].status,
        scheduledDate: user.orders[orderIndex].scheduledDate,
        serviceProvider: user.orders[orderIndex].serviceProvider,
        price: user.orders[orderIndex].price
      }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}