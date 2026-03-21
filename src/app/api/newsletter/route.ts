import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'A valid email is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 400 });
    }

    await Newsletter.create({ email });

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
