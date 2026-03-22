import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, addresses, preferredDelivery } = await req.json();
    await dbConnect();
    
    console.log('--- PROFILE UPDATE START ---');
    console.log('User ID:', session.user.id);

    const user = await User.findById(session.user.id);

    if (!user) {
      console.log('USER NOT FOUND IN DB');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Explicitly update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (preferredDelivery) user.preferredDelivery = preferredDelivery;
    if (addresses) user.addresses = addresses;

    await user.save();

    console.log('SAVED SUCCESSFULLY. ADDR LENGTH:', user.addresses?.length);
    console.log('--- PROFILE UPDATE END ---');

    // Return user without password
    const userResponse = JSON.parse(JSON.stringify(user));
    delete userResponse.password;

    return NextResponse.json(userResponse);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
