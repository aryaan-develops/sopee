import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { mockDb } from '@/lib/mockStore';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sellerId = (session.user as any).role === 'seller' ? (session.user as any).id : null;

    let orders;
    if (sellerId) {
      orders = mockDb.getSellerOrders(sellerId);
    } else if ((session.user as any).role === 'admin') {
      orders = mockDb.getOrders();
    } else {
      orders = mockDb.getUserOrders((session.user as any).id);
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

    const order = mockDb.addOrder({
      userId: (session.user as any).id,
      customerName: session.user.name,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        sellerId: item.sellerId || '2', // Fallback to main seller if not provided
      })),
      totalAmount,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
