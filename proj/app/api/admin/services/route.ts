import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import connectDB from '@/lib/db'
import Service from '@/models/Service'

type LeanService = {
  _id: any,
  title: string,
  type: string,
  description: string,
  active: boolean,
  category: string,
  price: number,
  items: any[],
  createdAt: Date
}

// Get all services
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const payload = await verifyToken(token)

    await connectDB()

    const services = (await Service.find({}).sort({ createdAt: -1 }).lean()).map(service => ({
      _id: service._id,
      title: service.title,
      type: service.type,
      description: service.description,
      active: service.active,
      category: service.category,
      price: service.price,
      items: service.items,
      createdAt: service.createdAt
    })) as LeanService[]

    return NextResponse.json({
      services: services.map(service => ({
        id: service._id.toString(),
        title: service.title,
        type: service.type,
        description: service.description,
        active: service.active,
        category: service.category,
        price: service.price,
        items: service.items,
        createdAt: service.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

// Create a new service
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || typeof payload === 'string' || !('isAdmin' in payload) || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { title, type, description, active, category, price, items } = await request.json()

    await connectDB()

    const existingService = await Service.findOne({ type })
    if (existingService) {
      return NextResponse.json({ error: 'Service with this type already exists' }, { status: 400 })
    }

    const service = await Service.create({
      title,
      type,
      description,
      active: active !== undefined ? active : true,
      category,
      price,
      items: items || []
    })

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
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
