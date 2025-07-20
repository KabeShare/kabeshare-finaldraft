import connectDB from '@/config/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    // Fetch the last 8 products sorted by date in descending order
    const products = await Product.find({}).sort({ date: -1 }).limit(10);

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
