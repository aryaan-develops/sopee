import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as any).role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Ensure the seller owns this product
    if (product.seller.toString() !== (session.user as any).id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
