import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { mockDb } from '@/lib/mockStore';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const category = searchParams.get('category');
    
    let products = mockDb.getProducts();
    
    if (sellerId) {
      products = products.filter((p: any) => p.sellerId === sellerId);
    }
    if (category && category !== 'All') {
      products = products.filter((p: any) => p.category === category);
    }
    
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, category, image } = await req.json();

    const product = mockDb.addProduct({
      name,
      description,
      price: Number(price),
      category,
      image,
      images: [image],
      sellerId: (session.user as any).id,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
