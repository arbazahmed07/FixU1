import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import Service from '@/models/Service';

// Get a specific service
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await verifyToken(token);
    await connectDB();
    
    // Get params properly by awaiting them
    const params = await context.params;
    
    const service = await Service.findById(params.id);
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      service: {
        id: service._id.toString(),
        title: service.title,
        type: service.type,
        description: service.description,
        active: service.active,
        category: service.category,
        price: service.price,
        items: service.items,
        createdAt: service.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

// Update a service
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
    if (!payload || typeof payload === 'string' || !('isAdmin' in payload) || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, type, description, active, category, price, items } = await request.json();
    
    await connectDB();
    
    // Get params properly
    const params = await context.params;
    
    // Check if service exists
    const service = await Service.findById(params.id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    // Update service fields
    service.title = title;
    service.type = type;
    service.description = description;
    service.active = active;
    service.category = category;
    service.price = price;
    service.items = items;
    
    await service.save();
    
    return NextResponse.json({
      success: true,
      service: {
        id: service._id.toString(),
        title: service.title,
        type: service.type,
        description: service.description,
        active: service.active,
        category: service.category,
        price: service.price,
        items: service.items,
        createdAt: service.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// Delete a service
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload === 'string' || !('isAdmin' in payload) || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    
    // Get params properly by awaiting them
    const params = await context.params;
    
    const result = await Service.findByIdAndDelete(params.id);
    if (!result) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}

// Toggle service status
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload === 'string' || !('isAdmin' in payload) || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    
    // Get params properly by awaiting them
    const params = await context.params;
    
    // Use the awaited params.id
    const service = await Service.findById(params.id);
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    // Toggle active status
    service.active = !service.active;
    await service.save();
    
    return NextResponse.json({
      success: true,
      active: service.active
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    return NextResponse.json({ error: 'Failed to update service status' }, { status: 500 });
  }
}