import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'not authorized' });
    }

    await connectDB();
    const users = await User.find(
      {},
      { name: 1, email: 1, imageUrl: 1, points: 1 }
    ); // Include imageUrl
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
