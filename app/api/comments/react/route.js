import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Comment from '@/models/Comment';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { commentId, reaction } = await request.json();

    await connectDB();
    const comment = await Comment.findById(commentId);

    const reactions = comment.reactions.get(reaction) || [];
    const hasReacted = reactions.includes(userId);

    if (hasReacted) {
      comment.reactions.set(
        reaction,
        reactions.filter((id) => id !== userId)
      );
    } else {
      comment.reactions.set(reaction, [...reactions, userId]);
    }

    await comment.save();
    return NextResponse.json({ success: true, comment });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
