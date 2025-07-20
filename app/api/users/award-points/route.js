import connectDB from '@/config/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId, points, productId } = await request.json();

    if (!userId || typeof points !== 'number' || !productId) {
      return NextResponse.json({
        success: false,
        message: 'Invalid data',
      });
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if points have already been awarded for this product
    if (user.awardedProducts?.includes(productId)) {
      return NextResponse.json({
        success: false,
        message: 'この画像にはすでにポイントが付与されている',
      });
    }

    // Award points and update awardedProducts
    user.points += points;
    user.awardedProducts = [...(user.awardedProducts || []), productId];
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Points awarded successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
