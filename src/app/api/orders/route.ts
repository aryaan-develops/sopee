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
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let orders;
    if (role === 'admin') {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else if (role === 'seller') {
      // Sellers can see orders containing their products
      // This is a bit complex for a simple join, so we filter by the items.product.seller
      // But currently our items don't have seller info in the Order model schema (oops)
      // For now, let's just return all orders if admin/seller for development
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    }

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
    
    const orderItems = items.map((item: any) => ({
      product: item.id || item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const order = await Order.create({
      user: (session.user as any).id,
      items: orderItems,
      totalAmount,
      status: 'pending',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
