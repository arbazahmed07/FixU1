import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';

// Public endpoint that only returns active services
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // For public consumption, determine if we should show only active services
    const showAll = request.nextUrl.searchParams.get('all') === 'true';
    
    // Filter query based on the "all" parameter
    const query = showAll ? {} : { active: true };
    
    // Get services
    const services = await Service.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ 
      services: services.map(service => ({
        id: (service as any)._id.toString(),
        title: service.title,
        type: service.type,
        description: service.description,
        category: service.category,
        price: service.price,
        items: service.items,
        active: service.active,
        createdAt: service.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}