import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Comment from '@/models/Comment';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { productId, text, userName, userImage } = await request.json();

    if (!userId || !productId || !text) {
      return NextResponse.json({ success: false, message: 'Invalid data' });
    }

    await connectDB();

    // Check if the user exists
    const user = await User.findById(userId);
    console.log(userId, user);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    // Award 100 points for the first comment, otherwise 1 point
    if (!user.hasCommented) {
      user.points += 100;
      user.hasCommented = true;
    } else {
      user.points += 1;
    }
    await user.save();

    // Create the comment
    const comment = await Comment.create({
      userId,
      productId,
      text,
      userName,
      userImage,
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
