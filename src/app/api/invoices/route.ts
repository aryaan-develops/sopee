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

    const { user } = session;
    let invoices;

    if (user.role === 'seller') {
      invoices = mockDb.getSellerInvoices(user.id);
    } else if (user.role === 'admin') {
      invoices = mockDb.getInvoices();
    } else {
      invoices = mockDb.getUserInvoices(user.id);
    }

    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
