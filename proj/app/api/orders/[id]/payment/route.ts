import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload === 'string' || !('userId' in payload)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { paymentId } = await request.json();

    await connectDB();
    
    // Properly access params by awaiting the context.params
    const { id: orderId } = await context.params;

    // Find the user with this order
    const user = await User.findOne({ 'orders._id': orderId });
    if (!user) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Find the order index
    const orderIndex = user.orders.findIndex(
      (order: any) => order._id.toString() === orderId
    );

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update the order with payment information
    // Use 'confirmed' instead of 'payment_completed' as per your model's enum
    user.orders[orderIndex].status = 'confirmed';
    user.orders[orderIndex].paymentId = paymentId;
    
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully',
      orderId: (user.orders[orderIndex] as any)._id.toString()
    });
  } catch (error) {
    console.error('Error updating order payment:', error);
    return NextResponse.json({ error: 'Failed to update order payment' }, { status: 500 });
  }
}
