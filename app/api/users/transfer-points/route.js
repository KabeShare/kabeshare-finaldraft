import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import Product from '@/models/Product';

export async function POST(request) {
  try {
    const { fromUserId, toUserId, points, productId } = await request.json();

    // Validate input
    if (!fromUserId || !toUserId || !points || !productId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get sender user
    const sender = await User.findById(fromUserId);
    if (!sender) {
      return NextResponse.json(
        { success: false, message: 'Sender not found' },
        { status: 404 }
      );
    }

    // Check if sender has enough points
    if (sender.points < points) {
      return NextResponse.json(
        { success: false, message: 'ポイントが足りません' },
        { status: 400 }
      );
    }

    // Get target product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: '作品が見つかりません' },
        { status: 404 }
      );
    }

    // Track appreciation in history
    const appreciation = {
      productId,
      points,
      date: new Date(),
    };

    // Update sender's points and appreciation history
    sender.points -= points;
    sender.appreciationHistory = [
      ...(sender.appreciationHistory || []),
      appreciation,
    ];
    await sender.save();

    // Update product's points and history
    product.pointsReceived = (product.pointsReceived || 0) + points;
    product.pointHistory = [
      ...(product.pointHistory || []),
      {
        points: points,
        date: new Date()
      }
    ];
    await product.save();

    // Add points to receiver (artist)
    const receiver = await User.findById(toUserId);
    if (receiver) {
      receiver.points = (receiver.points || 0) + points;
      await receiver.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Points transferred successfully',
    });
  } catch (error) {
    console.error('Transfer points error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
