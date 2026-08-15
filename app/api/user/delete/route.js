import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const { userId: requesterId } = getAuth(request);

    const isSeller = await authSeller(requesterId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'not authorized' });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required',
      });
    }

    await connectDB();
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
