import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ user: (session.user as any).id })
      .sort({ createdAt: -1 })
      .populate('items.product');

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items, totalAmount } = await req.json();

    await dbConnect();

    const order = await Order.create({
      user: (session.user as any).id,
      items: items.map((item: any) => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount,
      status: 'pending',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
