import connectDB from '@/config/db';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');

    await connectDB();
    const comments = await Comment.find({ productId }).sort({ date: -1 });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
