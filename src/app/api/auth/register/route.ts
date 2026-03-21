import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockStore';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const userExists = mockDb.getUserByEmail(email);

    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // In mock storage, we'll store simple passwords for now, or just plain text
    // for easy development. If bcrypt is needed, it would be better to keep it
    // consistent between register and login.
    const user = mockDb.addUser({
      name,
      email,
      password, // Storing as is for simplified mock dev
      role,
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
