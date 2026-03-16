import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { authOptions } from '@/lib/auth';

// Get all products or products by seller
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query: any = {};
    if (sellerId) query.seller = sellerId;
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Create a new product (Seller only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, category, image } = body;

    if (!name || !description || !price || !category || !image) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images: [image], // We'll use single image for now
      seller: (session.user as any).id,
    });

    console.log('Product created successfully:', product._id);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
