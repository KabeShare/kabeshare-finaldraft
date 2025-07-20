import connectDB from '@/config/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
