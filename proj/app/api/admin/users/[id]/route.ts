// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken, getTokenFromRequest } from '@/lib/auth';
// import connectDB from '@/lib/db';
// import User from '@/models/User';

// // Get a specific user
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const token = getTokenFromRequest(request);
//     if (!token) {
//       return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
//     }

//     const payload = await verifyToken(token);
//     if (!payload || !payload.isAdmin) {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     await connectDB();
    
//     const user = await User.findById(params.id).select('name email phone isAdmin createdAt') as { _id: any, name: string, email: string, phone: string, isAdmin: boolean, createdAt: Date } | null;
    
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
    
//     return NextResponse.json({
//       user: {
//         id: user._id.toString(),
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         isAdmin: user.isAdmin || false,
//         createdAt: user.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
//   }
// }

// // Update a user
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const token = getTokenFromRequest(request);
//     if (!token) {
//       return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
//     }

//     const payload = await verifyToken(token);
//     if (!payload || !payload.isAdmin) {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     const { name, email, password, phone, isAdmin } = await request.json();
    
//     await connectDB();
    
//     const user = await User.findById(params.id);
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
    
//     // Update user fields
//     user.name = name;
//     user.email = email;
//     if (password) {
//       user.password = password; // Will be hashed by pre-save hook
//     }
//     user.phone = phone;
//     user.isAdmin = isAdmin || false;
    
//     await user.save();
    
//     return NextResponse.json({
//       success: true,
//       user: {
//         id: user._id.toString(),
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         isAdmin: user.isAdmin
//       }
//     });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
//   }
// }

// // Delete a user
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const token = getTokenFromRequest(request);
//     if (!token) {
//       return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
//     }

//     const payload = await verifyToken(token);
//     if (!payload || !payload.isAdmin) {
//       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
//     }

//     await connectDB();
    
//     // Don't allow deleting your own account
//     if (params.id === payload.userId) {
//       return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
//     }
    
//     const result = await User.findByIdAndDelete(params.id);
//     if (!result) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: 'User deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const user = await User.findById(params.id).select('name email phone isAdmin createdAt') as {
      _id: mongoose.Types.ObjectId,
      name: string,
      email: string,
      phone?: string,
      isAdmin?: boolean,
      createdAt: Date
    } | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// Update a user
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
    if (!payload || typeof payload === 'string' || !payload.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, email, password, phone, isAdmin } = await request.json();

    await connectDB();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.name = name;
    user.email = email;
    if (password) {
      user.password = password; 
    }
    user.phone = phone;
    user.isAdmin = isAdmin || false;

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    if (params.id === payload.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const result = await User.findByIdAndDelete(params.id);
    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
